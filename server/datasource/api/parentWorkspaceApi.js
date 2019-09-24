/* eslint-disable no-use-before-define */
const _ = require('underscore');
const logger = require('log4js').getLogger('server');

const models = require('../schemas');
const { isNonEmptyArray, isNil } = require('../../utils/objects');
const {
  isValidMongoId,
  areObjectIdsEqual,
  auditObjectIdField,
  didObjectIdArrayFieldChange
} = require('../../utils/mongoose');

const { capitalizeWord } = require('../../utils/strings');

const { requireUser } = require('../../middleware/userAuth');

const { sendError, sendResponse } = require('../../middleware/requestHandler');

module.exports.post = {};

const generateParentWorkspace = async function(config, user) {
  try {
    let {
      name,
      linkedAssignment,
      owner,
      createdBy,
      childWorkspaces,
      mode,
      organization,
      doAutoUpdateFromChildren
    } = config;

    if (typeof doAutoUpdateFromChildren !== 'boolean') {
      doAutoUpdateFromChildren = false;
    }
    // if linkedAssignment is provided
    // need to

    // need to populate child workspaces
    // need submissions, responses,comments, selections, folders, taggings
    if (!isNonEmptyArray(childWorkspaces)) {
      return ['No child workspaces provided', null];
    }

    if (!name) {
      name = `Parent Workspace by ${user.username} (${Date.now})`;
    }

    let parentWorkspace = new models.Workspace({
      name,
      owner,
      createdBy,
      mode: mode || 'private',
      lastModifiedBy: createdBy,
      organization,
      workspaceType: 'parent',
      linkedAssignment,
      childWorkspaces,
      doAutoUpdateFromChildren,
      doAllowSubmissionUpdates: false,
    });

    let popChildWorkspaces = await populateChildWorkspaces(childWorkspaces);

    let { combinedWorkspace, oldToNewMap } = combineWorkspaces(
      popChildWorkspaces,
      {
        parentOwner: owner,
        parentCreator: createdBy,
        parentId: parentWorkspace._id
      }
    );

    let { combinedSubmissions, subOldToNewMap } = combineSubmissions(
      popChildWorkspaces
    );

    combinedWorkspace.submissions = combinedSubmissions;
    let withUpdatedRelationships = updateRelationships(
      combinedWorkspace,
      oldToNewMap,
      subOldToNewMap,
      parentWorkspace
    );

    await saveAllCombinedDocs(withUpdatedRelationships);

    // create taggings in top level folder for any
    // selections that were not tagged

    parentWorkspace.selections = withUpdatedRelationships.selections.map(
      s => s._id
    );
    parentWorkspace.folders = withUpdatedRelationships.folders.map(s => s._id);
    parentWorkspace.comments = withUpdatedRelationships.comments.map(
      s => s._id
    );
    parentWorkspace.taggings = withUpdatedRelationships.taggings.map(
      s => s._id
    );
    parentWorkspace.responses = withUpdatedRelationships.responses.map(
      s => s._id
    );
    parentWorkspace.submissions = withUpdatedRelationships.submissions.map(
      s => s._id
    );

    parentWorkspace.lastModifiedDate = Date.now();
    parentWorkspace.createDate = Date.now();

    await parentWorkspace.save();
    return [
      null,
      parentWorkspace,
    ];
  } catch (err) {
    console.log({ generateParentWorkspaceErr: err });
    return [err, null];
  }
};

const populateChildWorkspaces = workspaceIds => {
  if (!isNonEmptyArray(workspaceIds)) {
    return [];
  }

  let answerOptions = [
    { path: 'createdBy', select: 'username' },
    { path: 'problem', select: 'title' },
    { path: 'section', select: ['name', 'teachers'] }
  ];

  return models.Workspace.find({ _id: { $in: workspaceIds } })
    .populate({
      path: 'submissions',
      populate: [
        { path: 'answer', populate: answerOptions },
        { path: 'selections' },
        { path: 'responses' },
        { path: 'comments' }
      ]
    })
    .populate('selections')
    .populate({
      path: 'comments',
      populate: [{ path: 'children' }, { path: 'ancestors' }]
    })
    .populate({ path: 'folders', populate: 'taggings' })
    .populate('taggings')
    .populate({
      path: 'responses',
      populate: [{ path: 'selections' }, { path: 'comments' }]
    })
    .lean();
};

const combineWorkspaces = (workspaces, parentWsInfo) => {
  let results = {
    combinedWorkspace: {
      selections: [],
      comments: [],
      folders: [],
      taggings: [],
      responses: []
    },
    oldToNewMap: {
      selection: {},
      comment: {},
      folder: {},
      tagging: {},
      response: {}
    }
  };

  let { parentCreator, parentOwner, parentId } = parentWsInfo;

  try {
    return workspaces.reduce((acc, workspace) => {
      // copy selections
      // workspace submissions have answer, selections, responses, comments populated
      // workspace responses have selections and comments populated
      // workspace comments have children, ancestors populated
      let newParentFolder = new models.Folder({
        name: workspace.name,
        owner: parentOwner,
        createdBy: parentCreator,
        lastModifiedBy: parentCreator,
        workspace: parentId,
        srcChildWs: workspace._id
      });

      let defaultTaggings = [];

      acc.combinedWorkspace.selections = acc.combinedWorkspace.selections.concat(
        workspace.selections.map(oldSelection => {
          let copyOldSelection = {...oldSelection };
          let oldId = copyOldSelection._id;
          delete copyOldSelection._id;

          copyOldSelection.originalSelection = oldId;
          let newSelection = new models.Selection(copyOldSelection);
          newSelection.createDate = new Date();
          newSelection.lastModifiedDate = new Date();
          newSelection.lastModifiedBy = parentCreator;
          newSelection.createdBy = parentCreator;

          acc.oldToNewMap.selection[oldId] = newSelection._id;

          let isNotTagged = !isNonEmptyArray(newSelection.taggings);

          if (isNotTagged) {
            let defTagging = new models.Tagging({
              selection: newSelection._id,
              folder: newParentFolder._id,
              workspace: parentId,
              createdBy: newSelection.createdBy,
              createDate: new Date(),
              isDefaultTagging: true,
            });
            defaultTaggings.push(defTagging);
          }
          return newSelection;
        })
      );

      newParentFolder.taggings = defaultTaggings.map(t => t._id);
      // copy comments
      acc.combinedWorkspace.comments = acc.combinedWorkspace.comments.concat(
        workspace.comments.map(oldComment => {
          let oldId = oldComment._id;
          delete oldComment._id;

          oldComment.originalComment = oldId;
          oldComment.children = rejectTrashedDocs(oldComment.children).map(child => child._id);
          oldComment.ancestors = rejectTrashedDocs(oldComment.ancestors).map(ancestor => ancestor._id);

          let newComment = new models.Comment(oldComment);
          newComment.createDate = new Date();
          newComment.lastModifiedDate = new Date();
          newComment.lastModifiedBy = parentCreator;
          newComment.createdBy = parentCreator;

          acc.oldToNewMap.comment[oldId] = newComment._id;
          return newComment;
        })
      );

      // copy folders

      acc.combinedWorkspace.folders.push(newParentFolder);

      acc.combinedWorkspace.folders = acc.combinedWorkspace.folders.concat(
        workspace.folders.map(oldFolder => {
          let oldId = oldFolder._id;
          delete oldFolder._id;
          // each workspace needs to have one top level folder that's name is the name of the workspace
          // if folder is top level, we need to add this new folder as the parent

          let isTopLevel = !isValidMongoId(oldFolder.parent);

          if (isTopLevel) {
            oldFolder.parent = newParentFolder._id;
            if (!isValidMongoId(oldId)) {
              logger.error(`oldFolder: ${oldFolder}, oldFolderId: ${oldId}, workspacename: ${workspace.name}`);
              throw(new Error('Invalid child folder'));
            }
            newParentFolder.children.push(oldId);
          }
          oldFolder.originalFolder = oldId;
          let newFolder = new models.Folder(oldFolder);

          newFolder.createDate = new Date();
          newFolder.lastModifiedDate = new Date();
          newFolder.lastModifiedBy = parentCreator;
          newFolder.createdBy = parentCreator;

          acc.oldToNewMap.folder[oldId] = newFolder._id;
          return newFolder;
        })
      );

      // copy taggings
      acc.combinedWorkspace.taggings = acc.combinedWorkspace.taggings.concat(defaultTaggings);

      acc.combinedWorkspace.taggings = acc.combinedWorkspace.taggings.concat(
        workspace.taggings.map(oldTagging => {
          let oldId = oldTagging._id;
          delete oldTagging._id;

          oldTagging.originalTagging = oldId;
          let newTagging = new models.Tagging(oldTagging);
          newTagging.createDate = new Date();
          newTagging.lastModifiedDate = new Date();
          newTagging.lastModifiedBy = parentCreator;
          newTagging.createdBy = parentCreator;


          acc.oldToNewMap.tagging[oldId] = newTagging._id;
          return newTagging;
        })
      );

      // copy responses
      acc.combinedWorkspace.responses = acc.combinedWorkspace.responses.concat(
        workspace.responses.map(oldResponse => {
          let oldId = oldResponse._id;
          delete oldResponse._id;

          oldResponse.originalResponse = oldId;

          // there are rare cases of response referencing trashed selections comments
          oldResponse.selections = rejectTrashedDocs(oldResponse.selections).map(selection => selection._id);
          oldResponse.comments = rejectTrashedDocs(oldResponse.comments).map(comment => comment._id);

          let newResponse = new models.Response(oldResponse);

          newResponse.createDate = new Date();
          newResponse.lastModifiedDate = new Date();
          newResponse.lastModifiedBy = parentCreator;
          newResponse.createdBy = parentCreator;

          acc.oldToNewMap.response[oldId] = newResponse._id;
          return newResponse;
        })
      );
      return acc;
    }, results);
  } catch (err) {
    throw err;
  }
};

function rejectTrashedDocs(docArray) {
  if (!Array.isArray(docArray)) {
    return [];
  }
  return docArray.filter((doc) => {
    if (isValidMongoId(doc)) {
      throw(new Error('got object Id when should be populated doc'));
    }
    return doc && !doc.isTrashed;
  });
}

const combineSubmissions = workspaces => {
  let oldToNewMap = {};

  let submissionHash = workspaces.reduce((acc, workspace) => {
    let submissions = workspace.submissions || [];
    submissions.forEach(submission => {
      // submission has answer, responses, comments, selections populated
      let answer = submission.answer;
      if (!acc[answer._id]) {
        let oldId = submission._id;
        delete submission._id;

        submission.answer = answer._id;
        submission.originalSubmission = oldId;

        // filter out trashed responses, comments, selections

        submission.selections = rejectTrashedDocs(submission.selections).map(
          selection => selection._id
        );
        submission.comments = rejectTrashedDocs(submission.comments).map(
          comment => comment._id
        );
        submission.responses = rejectTrashedDocs(submission.responses).map(
          response => response._id
        );

        let newSubmission = new models.Submission(submission);
        oldToNewMap[oldId] = newSubmission._id;
        acc[answer._id] = newSubmission;
      } else {
        // take markup from this submission and add to
        // only take NON trashed markup
        // if trashed markup is later untrashed, will get pulled in by update
        acc[answer._id].selections = acc[answer._id].selections.concat(
          rejectTrashedDocs(submission.selections).map(selection => selection._id)
        );

        acc[answer._id].comments = acc[answer._id].comments.concat(
          rejectTrashedDocs(submission.comments).map(comment => comment._id)
        );

        acc[answer._id].responses = acc[answer._id].responses.concat(
          rejectTrashedDocs(submission.responses).map(response => response._id)
        );

        oldToNewMap[submission._id] = acc[answer._id]._id;
      }
    });
    return acc;
  }, {});

  return {
    combinedSubmissions: Object.values(submissionHash),
    subOldToNewMap: oldToNewMap
  };
};

const updateRelationships = (
  combinedWorkspace,
  oldToNewMap,
  subOldToNewMap,
  parentWs
) => {
  combinedWorkspace.submissions = combinedWorkspace.submissions.map(
    submission => {
      submission.selections = submission.selections.map(selection => {
        // selection is objectId
        return oldToNewMap.selection[selection];
      });
      submission.responses = submission.responses.map(response => {
        // response is objectId
        return oldToNewMap.response[response];
      });
      submission.comments = submission.comments.map(comment => {
        // comment is objectId
        return oldToNewMap.comment[comment];
      });
      submission.workspaces = [parentWs._id];
      return submission;
    }
  );

  combinedWorkspace.selections = combinedWorkspace.selections.map(selection => {
    selection.taggings = selection.taggings.map(tagging => {
      // tagging is objectId
      return oldToNewMap.tagging[tagging];
    });
    selection.comments = selection.comments.map(comment => {
      // comment is objectId
      return oldToNewMap.comment[comment];
    });

    selection.submission = subOldToNewMap[selection.submission];
    selection.workspace = parentWs._id;
    return selection;
  });

  combinedWorkspace.comments = combinedWorkspace.comments.map(comment => {
    comment.ancestors = comment.ancestors.map(ancestor => {
      // ancestor is objectId
      let isAncestorFromSameWs = isValidMongoId(oldToNewMap.comment[ancestor]);

      if (!isValidMongoId(ancestor)) {
        throw new Error('expected object id for ancestor');
      }
      if (isAncestorFromSameWs) {
        return oldToNewMap.comment[ancestor];
      }
      return ancestor;
    });

    comment.children = comment.children.map(child => {
      // child is objectId
      if (!isValidMongoId(child)) {
        throw new Error('expected object id for child');
      }
      let isChildFromSameWs = isValidMongoId(oldToNewMap.comment[child]);

      if (isChildFromSameWs) {
        return oldToNewMap.comment[child];
      }
      return child;
    });

    // parent is not necessarily from this workspce
    // one can reuse a comment from another workspace, and that
    // comment will be this comment's parent

    let isParentFromSameWs = isValidMongoId(oldToNewMap.comment[comment.parent]);

    if (isParentFromSameWs) {
      comment.parent = oldToNewMap.comment[comment.parent];
    } else if (comment.parent) {
      logger.info(`comment originated from reusing a comment from another workspace: ${comment.parent}`);
    }

    comment.submission = subOldToNewMap[comment.submission];
    comment.selection = oldToNewMap.selection[comment.selection];
    comment.workspace = parentWs._id;

    return comment;
  });

  combinedWorkspace.folders = combinedWorkspace.folders.map(folder => {
    folder.children = folder.children.map(child => {
      let newChildId = oldToNewMap.folder[child];

      if (!newChildId) {
        logger.error(`folder: ${folder}, oldToNewMap.folder: ${JSON.stringify(oldToNewMap.folder, null, 2)}`);
        throw(new Error('invalid child folder'));
      }
      return newChildId;
    });

    if (folder.parent && oldToNewMap.folder[folder.parent]) {
      // we do not want to update the parent of folders that were previously top level

      folder.parent = oldToNewMap.folder[folder.parent];
      folder.taggings = folder.taggings.map(tagging => {
        return oldToNewMap.tagging[tagging];
      });
      folder.workspace = parentWs._id;
    }
    folder.workspace = parentWs._id;
    return folder;
  });

  combinedWorkspace.taggings = combinedWorkspace.taggings.map(tagging => {
    if (isValidMongoId(tagging.originalTagging)) {
      // do not want to update default taggings that were creating
      // during the combining process
      tagging.folder = oldToNewMap.folder[tagging.folder];
      tagging.selection = oldToNewMap.selection[tagging.selection];
      tagging.workspace = parentWs._id;
    }
    return tagging;
  });

  combinedWorkspace.responses = combinedWorkspace.responses.map(response => {
    response.selections = response.selections.map(selection => {
      // selection is objectId
      return oldToNewMap.selection[selection];
    });

    response.comments = response.comments.map(comment => {
      // comment is objectId
      return oldToNewMap.comment[comment];
    });

    response.submission = subOldToNewMap[response.submission];
    response.priorRevision = subOldToNewMap[response.priorRevision];
    response.workspace = parentWs._id;
    return response;
  });

  return combinedWorkspace;
};

const saveAllCombinedDocs = combinedWorkspace => {
  let savedSubmissions = Promise.all(
    combinedWorkspace.submissions.map(submission => {
      return submission.save({ validateBeforeSave: false });
    })
  );

  let savedSelections = Promise.all(
    combinedWorkspace.selections.map(selection => {
      return selection.save({ validateBeforeSave: false });
    })
  );

  let savedComments = Promise.all(
    combinedWorkspace.comments.map(comment => {
      return comment.save({ validateBeforeSave: false });
    })
  );

  let savedFolders = Promise.all(
    combinedWorkspace.folders.map(folder => {
      return folder.save({ validateBeforeSave: false });
    })
  );

  let savedTaggings = Promise.all(
    combinedWorkspace.taggings.map(tagging => {
      return tagging.save({ validateBeforeSave: false });
    })
  );

  let savedResponses = Promise.all(
    combinedWorkspace.responses.map(response => {
      return response.save({ validateBeforeSave: false });
    })
  );

  return Promise.all([
    savedSubmissions,
    savedComments,
    savedSelections,
    savedFolders,
    savedTaggings,
    savedResponses
  ]);
};

const postParentWorkspace = async (req, res, next) => {
  try {
    let user = requireUser(req);
    let { parentWorkspaceRequest }  = req.body;

    let results = await generateParentWorkspace(parentWorkspaceRequest, user);

    let { parentWorkspace, errorMsg } = results;

    let data = { parentWorkspaceRequest };

    if (parentWorkspace) {
      parentWorkspaceRequest.createdWorkspace = parentWorkspace._id;
      data.workspace = [ parentWorkspace ];

      // update childWorkspaces with id of parent Workspace
      if (isNonEmptyArray(parentWorkspace.childWorkspaces)) {
        models.Workspace.updateMany({_id: {$in: parentWorkspace.childWorkspaces}}, {$addToSet: {parentWorkspaces: parentWorkspace._id}});
      }
    }

    parentWorkspaceRequest.createWorkspaceError = errorMsg;

    return sendResponse(res, data);
  }catch(err) {
    console.log(`postParentWorkspace err: ${err}`);
    return sendError.InternalError(null, res);
  }
};

const updateSubmissions = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any answers that parentWs doesn't

  let parentWsAnswerIds = parentWs.submissions.map(submission => {
    return submission.answer;
  });

  let subFilter = {
    workspaces: { $elemMatch: { $in: childWorkspaces } },
    isTrashed: false,
  };

  let updatedSubmissions = [];

  if (isNonEmptyArray(parentWsAnswerIds)) {
    subFilter.answer = { $nin: parentWsAnswerIds };
  }

  let childSubmissionsToAdd = await models.Submission.find(subFilter).populate(
    'answer'
  );

  let createdSubmissions = await Promise.all(
    childSubmissionsToAdd.map(childSubmission => {
      return createParentSubmissionCopy(userId, childSubmission, parentWs._id);
    })
  );
  return [ createdSubmissions, updatedSubmissions ];
};

const createParentSubmissionCopy = (
  userId,
  childSubmission,
  parentWorkspace
) => {
  // expect childSubmission to be a mongoose document
  // expect parentWorkspaceId to be populatedWorkspace

  let results = {
    createdRecord: null,
    errorMsg: null,
  };

  let childPlain = childSubmission.toObject();

  let fieldsToOmit = [
    '_id',
    'createDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'createdBy',
    'responses',
    'workspaces',
    'comments',
    'selections'
  ];

  let childCopy = _.omit(childPlain, fieldsToOmit);

  childCopy.lastModifiedBy = userId;
  childCopy.lastModifiedDate = new Date();
  childCopy.createdBy = userId;
  childCopy.workspaces = [parentWorkspace._id];
  childCopy.originalSubmission = childSubmission._id;

  return models.Submission.create(childCopy)
    .then((submission) => {
      results.createdRecord = submission;
      return results;
    })
    .catch((err) => {
      throw(err);
    });
};

const createParentSelectionCopy = async (userId, childSelection, parentWorkspace) => {
  // expect childSelection to be a mongoose document
  // expect parentWorkspaceId to be populated workspace
  try {
    let results = {
      createdRecord: null,
      errorMsg: null,
      createdDefaultTagging: null
    };

    await childSelection.populate('submission').execPopulate();

    let childPlain = childSelection.toObject();

    let originalWorkspaceId = childPlain.workspace;

    let fieldsToOmit = [
      '_id',
      'createDate',
      'lastModifiedDate',
      'lastModifiedBy',
      'createdBy',
      'workspace',
      'comments',
      'taggings',
    ];

    let childCopy = _.omit(childPlain, fieldsToOmit);

    childCopy.lastModifiedBy = userId;
    childCopy.lastModifiedDate = new Date();
    childCopy.createdBy = userId;
    childCopy.workspace = parentWorkspace._id;
    childCopy.originalSelection = childSelection._id;

    let childAnswerId = childCopy.submission.answer;

    let parentSub = _.find(parentWorkspace.submissions, popSubmission => {
      return areObjectIdsEqual(popSubmission.answer, childAnswerId);
    });

    if (!parentSub) {
      // should never happen
      results.errorMsg = `Could not find corresponding parent submission in parent workspace ${parentWorkspace._id} for child selection ${childSelection._id}`;
      return results;
    }


    childCopy.submission = parentSub._id;

    // new selection will not have any comments

    // new selection will never have taggings
    // create default tagging for default workspace folder

    return models.Selection.create(childCopy)
      .then((selection) => {
        results.createdRecord = selection;
        let parentFolder = _.find(parentWorkspace.folders, (popFolder) => {
          return areObjectIdsEqual(popFolder.srcChildWs, originalWorkspaceId);
        });
        if (!parentFolder) {
          // should never happen
            // should never happen
            results.errorMsg = `Could not find default child workspace folder in parent workspace ${parentWorkspace._id} for child selection ${childSelection._id}`;
            return results;
        }
        return models.Tagging.create({
          selection: selection._id,
          folder: parentFolder._id,
          workspace: parentWorkspace._id,
          createdBy: userId,
          lastModifiedBy: userId,
          lastModifiedDate: new Date(),
          isDefaultTagging: true,
        })
          .then((tagging) => {
            selection.taggings = [ tagging._id ];
            selection.lastModifiedDate = new Date();
            results.createdDefaultTagging = tagging;
            return selection.save()
            .then((updatedSelection) => {
              results.createdRecord = updatedSelection;
              return results;
            });
          });
      });
  }catch(err) {
    throw(err);
  }

};

const updateSelections = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any selections that parent ws doesnt have
  // or if folders were deleted from child workspaces

  let parentWsChildSelectionIds = parentWs.selections.map(selection => {
    return selection.originalSelection;
  });

  let selectionFilter = {
    workspace: { $in: childWorkspaces },
    isTrashed: false, // dont want to create a parent copy for a child record that was trashed
  };

  let updatedSelections = [];

  if (isNonEmptyArray(parentWsChildSelectionIds)) {
    selectionFilter._id = { $nin: parentWsChildSelectionIds };

    // check if need to remove any selections
    updatedSelections = await Promise.all(
      parentWs.selections.map(async parentSelectionId => {
        let parentSelection = await models.Selection.findById(
          parentSelectionId
        ).populate('originalSelection');

        if (!parentSelection || !parentSelection.originalSelection) {
          // nonexistant id, remove from workspace?
          // shouldn't happen unless something went wrong
          let errorMsg = `Parent workspace ${parentWs._id} contains a nonexistant selection ${parentSelectionId}`;

          logger.error(errorMsg);

          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: errorMsg
          };
        }
        let childSelection = parentSelection.originalSelection;

        // determine if fields were modified. for now just do isTrashed
        let modifiedFields = [];

        let simpleFields = [
          'isTrashed',
          'relativeCoords',
          'relativeSize'
        ];

        simpleFields.forEach((field) => {
          if(!_.isEqual(parentSelection[field], childSelection[field])) {
            modifiedFields.push(field);
          }
        });

        if (modifiedFields.length > 0) {
          return updateParentRecord(
            userId,
            parentSelection.originalSelection,
            'selection',
            modifiedFields
          );
        }
        return {
          didUpdate: false,
          updatedRecord: null,
          modifiedFields: [],
          errorMsg: 'No modified fields to update'
        };
      })
    );
  }

  let childSelectionsToAdd = await models.Selection.find(selectionFilter).populate(
    'submission'
  );

  let createdSelections = await Promise.all(
    childSelectionsToAdd.map(childSelection => {
      return createParentSelectionCopy(userId, childSelection, parentWs);
    })
  );
  return [ createdSelections, updatedSelections ];
};

const createParentCommentCopy = async (userId, childComment, parentWorkspace) => {
  // expect childComment to be a mongoose document
  // expect parentWorkspaceId to be populated workspace
  try {
    let results = {
      createdRecord: null,
      errorMsg: null,
    };

    await childComment.populate('submission').execPopulate();
    let childPlain = childComment.toObject();

    let fieldsToOmit = [
      '_id',
      'createDate',
      'lastModifiedDate',
      'lastModifiedBy',
      'createdBy',
      'workspace'
    ];

    let childCopy = _.omit(childPlain, fieldsToOmit);

    childCopy.lastModifiedBy = userId;
    childCopy.lastModifiedDate = new Date();
    childCopy.createdBy = userId;
    childCopy.workspace = parentWorkspace._id;
    childCopy.originalComment = childComment._id;

    let childAnswerId = childCopy.submission.answer;

    let parentSub = _.find(parentWorkspace.submissions, popSubmission => {
      return areObjectIdsEqual(popSubmission.answer, childAnswerId);
    });

    if (!parentSub) {
      // should never happen
      results.errorMsg = `Could not find corresponding parent submission in parent workspace ${parentWorkspace._id} for child comment ${childComment._id}`;
      return results;
    }
    childCopy.submission = parentSub._id;

    if (isValidMongoId(childCopy.parent)) {
      // find corresponding parent comment in parent ws
      let parentWsParent = _.find(parentWorkspace.comments, c => {
        return areObjectIdsEqual(c.originalComment, childCopy.parent);
      });

      if (parentWsParent) {
        childCopy.parent = parentWsParent._id;
      }
      // parent does not have to be from this ws (can reuse any comment from any ws that you have access to)
      // just leave parent as is
      // should we check the parent is valid?
    }

    if (isNonEmptyArray(childCopy.ancestors)) {
      // ancestors do not necessarily have to be from this workspace
      // if someone reeuses your comment, their comment will be a child of yours
      childCopy.ancestors = childCopy.ancestors.map(ancestor => {
        // find this ancestor comment in parent ws
        let parentWsAncestor = _.find(parentWorkspace.comments, c => {
          return areObjectIdsEqual(c.originalComment, ancestor);
        });

        if (parentWsAncestor) {
          return parentWsAncestor;
        }

        // ancestor not from this ws, just return original ancestor
        return ancestor;
      });

      childCopy.ancestors = _.compact(childCopy.ancestors);
    }

    if (isNonEmptyArray(childCopy.children)) {
      // children do not necessarily have to be from this workspace
      // if someone reeuses your comment, their comment will be a child of yours
      childCopy.children = childCopy.children.map(child => {
        // find this child comment in parent ws
        let parentWsChild = _.find(parentWorkspace.comments, c => {
          return areObjectIdsEqual(c.originalComment, child);
        });

        if (parentWsChild) {
          return parentWsChild;
        }

        // child not from this ws, just return original child
        return child;
      });

      childCopy.children = _.compact(childCopy.children);
    }

    // find corresponding selection in parentWs

    let parentSelection = _.find(parentWorkspace.selections, s => {
      return areObjectIdsEqual(s.originalSelection, childCopy.selection);
    });

    if (!parentSelection) {
      // should never happen
      results.errorMsg = `Could not find corresponding parent selection in parent workspace ${parentWorkspace._id} for child comment ${childComment._id}`;
      return results;
    }
    childCopy.selection = parentSelection._id;

    let createdRecord = await models.Comment.create(childCopy);
    results.createdRecord = createdRecord;
    return results;

  }catch(err) {
    throw(err);
  }
};

const updateComments = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any comments that parent ws doesnt have

  let parentWsCommentIds = parentWs.comments.map(comment => {
    return comment.originalComment;
  });

  let commentFilter = {
    workspace: { $in: childWorkspaces },
    isTrashed: false // dont want to create a parent copy for a child record that was trashed
  };

  let updatedComments = [];

  if (isNonEmptyArray(parentWsCommentIds)) {
    commentFilter._id = {
      $nin: parentWsCommentIds
    };

    updatedComments = await Promise.all(
      parentWs.comments.map(async parentCommentId => {
        let parentComment = await models.Comment.findById(
          parentCommentId
        ).populate('originalComment');

        if (!parentComment || !parentComment.originalComment) {
          // nonexistant id, remove from workspace?
          // shouldn't happen unless something went wrong
          let errorMsg = `Parent workspace ${parentWs._id} contains a nonexistant comment ${parentCommentId}`;
          logger.error(errorMsg);
          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: errorMsg
          };
        }
        let childComment = parentComment.originalComment;

        let mappedParent = await mapCommentParent(childComment, parentWs._id);
        let didParentChange = auditObjectIdField(parentComment.parent, mappedParent);

        let mappedAncestors = await mapCommentAncestors(childComment, parentWs._id);
        let didAncestorsChange = didObjectIdArrayFieldChange(parentComment.ancestors, mappedAncestors);

        let mappedChildren = await mapCommentChildren(childComment, parentWs._id);
        let didChildrenChange = didObjectIdArrayFieldChange(parentComment.children, mappedChildren);
        // determine if fields were modified. for now just do isTrashed
        let modifiedFields = [];

        if (didParentChange) {
          modifiedFields.push('parent');
        }
        if (didAncestorsChange) {
          modifiedFields.push('ancestors');
        }
        if (didChildrenChange) {
          modifiedFields.push('children');
        }

        let simpleFields = ['isTrashed'];

        simpleFields.forEach((field) => {
          if (!_.isEqual(parentComment[field], childComment[field])) {
            modifiedFields.push(field);
          }
        });

        if (modifiedFields.length > 0) {
          return updateParentRecord(
            userId,
            parentComment.originalComment,
            'comment',
            modifiedFields
          );
        }
        return {
          didUpdate: false,
          updatedRecord: null,
          modifiedFields: [],
          errorMsg: 'No modified fields to update'
        };
      })
    );
  }

  let childComments = await models.Comment.find(commentFilter).populate(
    'submission'
  );

  let createdComments = await Promise.all(
    childComments.map(childComment => {
      return createParentCommentCopy(userId, childComment, parentWs);
    })
  );
    return [ createdComments, updatedComments ];
};

const mapCommentChildren = (childComment, parentWorkspaceId) => {
  let originalChildren = childComment.children || [];
  return Promise.all(originalChildren.map((originalChildId) => {
    let filter = { originalComment: originalChildId, workspace: parentWorkspaceId };
    // comment children can be from other workspaces
    return models.Comment.findOne(filter)
      .then((parentChild) => {
        return parentChild ? parentChild._id : originalChildId;
      });
  }))
  .then((childrenIds) => {
    return _.compact(childrenIds);
  })
  .catch((err) => {
    throw(err);
  });
};

const mapCommentAncestors = (childComment, parentWorkspaceId) => {
  let originalAncestors = childComment.ancestor || [];
  return Promise.all(originalAncestors.map((originalAncestorId) => {
    let filter = { originalComment: originalAncestorId, workspace: parentWorkspaceId };
    // comment ancestor can be from other workspaces
    return models.Comment.findOne(filter)
      .then((parentAncestor) => {
        return parentAncestor ? parentAncestor._id : originalAncestorId;
      });
  }))
  .then((ancestorIds) => {
    return _.compact(ancestorIds);
  })
  .catch((err) => {
    throw(err);
  });

};

const mapCommentParent = (childComment, parentWorkspaceId) => {
  let originalParentId = childComment.parent;
  return models.Comment.findOne({ originalComment: originalParentId, workspace: parentWorkspaceId})
    .then((parentParent) => {
      return parentParent ? parentParent._id : originalParentId;
    })
    .catch((err) => {
      throw(err);
    });
};



const mapFolderChildren = (childFolder) => {
  let childChildrenIds = childFolder.children || [];
  return Promise.all(childChildrenIds.map((childId) => {
    return models.Folder.findOne({ originalFolder: childId })
    .then((parentChild) => {
      return parentChild ? parentChild._id : null;
    });
  }))
  .then((parentChildrenIds) => {
    return _.compact(parentChildrenIds);
  }).catch((err) => {
    throw(err);
  });
};

const mapFolderParent = (childFolder, parentWorkspaceId) => {
  let childParentId = childFolder.parent;
  let resultParent;

  if (childParentId) {
    resultParent = models.Folder.findOne({ originalFolder: childParentId });
  } else {
    // find default ws folder
    resultParent = models.Folder.findOne({
      srcChildWs: childFolder.workspace,
      workspace: parentWorkspaceId
    });
  }

  return resultParent
    .then(parentParentFolder => {
      return parentParentFolder ? parentParentFolder._id : null;
    })
    .catch(err => {
      throw err;
    });
};

const mapResponsePriorRevision = (childResponse) => {
  let priorRevision = childResponse.priorRevision;

  return models.Response.findOne({ originalResponse: priorRevision })
    .then((parentRevision) => {
      return parentRevision ? parentRevision._id : null;
    })
    .catch((err) => {
      throw(err);
    });
};

const mapResponseReviewedResponse = (childResponse) => {
  let reviewedResponse = childResponse.reviewedResponse;

  return models.Response.findOne({ originalResponse: reviewedResponse })
    .then((parentResponse) => {
      return parentResponse ? parentResponse._id : null;
    })
    .catch((err) => {
      throw(err);
    });
};

const updateResponses = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any comments that parent ws doesnt have

  let parentWsResponseIds = parentWs.responses.map(response => {
    return response.originalResponse;
  });

  // should we filter out drafts?
  let responseFilter = {
    workspace: { $in: childWorkspaces },
    isTrashed: false // dont want to create a parent copy for a child record that was trashed
  };

  let updatedResponses = [];

  if (isNonEmptyArray(parentWsResponseIds)) {
    responseFilter._id = { $nin: parentWsResponseIds };

    updatedResponses = await Promise.all(
      parentWs.responses.map(async parentResponseId => {
        let parentResponse = await models.Response.findById(
          parentResponseId
        ).populate('originalResponse');

        if (!parentResponse || !parentResponse.originalResponse) {
          // nonexistant id, remove from workspace?
          // shouldn't happen unless something went wrong
          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: 'Nonexistant parent or original response'
          };
        }
        let childResponse = parentResponse.originalResponse;

        let childPriorRevision = childResponse.priorRevision;
        let childReviewedResponse = childResponse.reviewedResponse;

        let parentRevision = null;
        let parentReviewedResponse = null;

        if (childPriorRevision) {
          parentRevision = await mapResponsePriorRevision(childResponse);
        }

        if (childReviewedResponse) {
          parentReviewedResponse = await mapResponseReviewedResponse(childResponse);
        }

        let didPriorRevisionChange =
          auditObjectIdField(parentResponse.priorRevision, parentRevision) !== 0;
        let didReviewedResponseChange =
          auditObjectIdField(parentResponse.reviewedResponse, parentReviewedResponse) !== 0;

          console.log(
            `Did prior revision change for response ${parentResponse}? ${didPriorRevisionChange}`
          );

          console.log(
            `Did reviewedResponse change for response ${parentResponse}? ${didReviewedResponseChange}`
          );


        // determine if fields were modified
        let modifiedFields = [];

        if (didPriorRevisionChange) {
          modifiedFields.push('priorRevision');
        }
        if (didReviewedResponseChange) {
          modifiedFields.push('reviewedResponse');
        }


        let simpleFields = [
          'isTrashed',
          'status',
          'text',
          'note',
          'approvedBy',
          'unapprovedBy',
          'wasReadByRecipient',
          'wasReadByApprover',
        ];

        simpleFields.forEach((field) => {
          if (!_.isEqual(parentResponse[field], childResponse[field])) {
            modifiedFields.push(field);
          }
        });

        if (modifiedFields.length > 0) {
          return updateParentRecord(
            userId,
            parentResponse.originalResponse,
            'response',
            modifiedFields
          );
        }
        return {
          didUpdate: false,
          updatedRecord: null,
          modifiedFields: [],
          errorMsg: 'No updated fields to save'
        };
      })
    );
  }

  let childResponses = await models.Response.find(responseFilter).populate(
    'submission'
  );
  let createdResponses = await Promise.all(
    childResponses.map(childResponse => {
      return createParentResponseCopy(userId, childResponse, parentWs);
    })
  );
  return [ createdResponses, updatedResponses ];
};

const createParentResponseCopy = async (userId, childResponse, parentWorkspace) => {
  // expect childResponse to be a mongoose document
  // expect parentWorkspace to be populated workspace
  try {
    let results = {
      createdRecord: null,
      errorMsg: null,
    };

    await childResponse.populate('submission').execPopulate();

    let childPlain = childResponse.toObject();

    let fieldsToOmit = [
      '_id',
      'createDate',
      'lastModifiedDate',
      'lastModifiedBy',
      'createdBy',
      'workspace'
    ];

    let childCopy = _.omit(childPlain, fieldsToOmit);

    childCopy.lastModifiedBy = userId;
    childCopy.lastModifiedDate = new Date();
    childCopy.createdBy = userId;
    childCopy.workspace = parentWorkspace._id;
    childCopy.originalResponse = childResponse._id;

    let childAnswerId = childCopy.submission.answer;

    let parentSub = _.find(parentWorkspace.submissions, popSubmission => {
      return areObjectIdsEqual(popSubmission.answer, childAnswerId);
    });

    if (!parentSub) {
      // should never happen
      results.errorMsg = `Could not find corresponding parent submission in parent workspace ${parentWorkspace._id} for child response ${childResponse._id}`;
      return results;
    }
    childCopy.submission = parentSub._id;

    if (isValidMongoId(childCopy.priorRevision)) {
      // find corresponding revision in parent ws
      let parentWsRevision = _.find(parentWorkspace.responses, r => {
        return areObjectIdsEqual(r.originalResponse, childCopy.priorRevision);
      });

      if (!parentWsRevision) {
        // should never happen
        results.errorMsg = `Could not find corresponding parent priorRevision response in parent workspace ${parentWorkspace._id} for child response ${childResponse._id}`;
        return results;
      }
      childCopy.priorRevision = parentWsRevision._id;
    }

    if (isValidMongoId(childCopy.reviewedResponse)) {
      // find corresponding revision in parent ws
      let parentWsRevision = _.find(parentWorkspace.responses, r => {
        return areObjectIdsEqual(r.originalResponse, childCopy.reviewedResponse);
      });

      if (!parentWsRevision) {
        // should never happen
        results.errorMsg = `Could not find corresponding parent reviewedResponse response in parent workspace ${parentWorkspace._id} for child response ${childResponse._id}`;
        return results;
      }
      childCopy.reviewedResponse = parentWsRevision._id;
    }

    if (isNonEmptyArray(childCopy.selections)) {
      childCopy.selections = childCopy.selections.map(selection => {
        // find this selection in parent ws
        let parentWsSelection = _.find(parentWorkspace.selections, s => {
          return areObjectIdsEqual(s.originalSelection, selection);
        });

        if (!parentWsSelection) {
          // should never happen
          logger.error(`Could not find corresponding parent selection in parent workspace ${parentWorkspace._id} for child response ${childResponse._id}`);
          return;
          }
        return selection;
      });

      childCopy.selections = _.compact(childCopy.selections);
    }
    if (isNonEmptyArray(childCopy.comments)) {
      childCopy.comments = childCopy.comments.map(comment => {
        // find this comment in parent ws
        let parentWsComment = _.find(parentWorkspace.comments, c => {
          return areObjectIdsEqual(c.originalComment, comment);
        });

        if (!parentWsComment) {
          // should never happen
          logger.error(`Could not find corresponding parent comment in parent workspace ${parentWorkspace._id} for child response ${childResponse._id}`);
          return;
        }
        return comment;
      });

      childCopy.selections = _.compact(childCopy.selections);
    }

    let createdRecord = await models.Response.create(childCopy);
    results.createdRecord = createdRecord;
    return results;

  }catch(err) {
    throw(err);
  }
};

const updateFolders = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any folders that parent ws doesnt have

  let parentWsFolderIds = parentWs.folders.map(folder => {
    return folder.originalFolder;
  });

  let folderFilter = {
    workspace: { $in: childWorkspaces },
    isTrashed: false // dont want to create a parent copy for a child record that was trashed

  };

  let updatedFolders = [];

  if (isNonEmptyArray(parentWsFolderIds)) {
    folderFilter._id = { $nin: parentWsFolderIds };

    updatedFolders = await Promise.all(
      parentWs.folders.map(async parentFolderId => {
        let parentFolder = await models.Folder.findById(
          parentFolderId
        ).populate('originalFolder');

        if (!parentFolder) {
          // nonexistant id, remove from workspace?
          // shouldn't happen unless something went wrong
          let errorMsg = `Parent workspace ${parentWs._id} contains a nonexistant folder ${parentFolderId}`;
          logger.error(errorMsg);
          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: errorMsg
          };
        }

        if (parentFolder.srcChildWs) {
          logger.info(
            'Default child workspace folder, do not need to check for updates'
          );
          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: null
          };
        }
        let childFolder = parentFolder.originalFolder;

        if (!childFolder) {
          let errorMsg = `Parent workspace ${parentWs._id} contains a folder without an original folder:  ${parentFolderId}`;

          logger.error(errorMsg);

          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: errorMsg
          };
        }

        let parentChildren = await mapFolderChildren(childFolder);
        let parentParent = await mapFolderParent(childFolder, parentWs._id);

        let didParentChange = auditObjectIdField(parentFolder.parent, parentParent) !== 0;

        let didChildrenChange = didObjectIdArrayFieldChange(parentFolder.children, parentChildren);
        console.log(`Did the parent of ${parentFolder.name} change?: ${didParentChange}`);
        console.log(`Did the children of ${parentFolder.name} change?: ${didChildrenChange}`);

        let simpleCompares = ['isTrashed', 'name', 'weight'];

        let modifiedFields = [];

        if (didParentChange) {
          modifiedFields.push('parent');
        }

        if (didChildrenChange) {
          modifiedFields.push('children');
        }

        simpleCompares.forEach((fieldName) => {
          let didChange = childFolder[fieldName] !== parentFolder[fieldName];
          if (didChange) {
            modifiedFields.push(fieldName);
          }
        });

        if (modifiedFields.length > 0) {
          return updateParentRecord(
            userId,
            parentFolder.originalFolder,
            'folder',
            modifiedFields
          );
        }
        return {
          didUpdate: false,
          updatedRecord: null,
          modifiedFields: [],
          errorMsg: 'No updated fields to save'
        };
      })
    );
  }

  let childFolders = await models.Folder.find(folderFilter);

  let createdFolders = await Promise.all(
    childFolders.map(childFolder => {
      return createParentFolderCopy(userId, childFolder, parentWs);
    })
  );

  return [ createdFolders, updatedFolders ];
};

const createParentFolderCopy = (userId, childFolder, parentWorkspace) => {
  // expect childFolder to be a mongoose document
  // expect parentWorkspace to be populated workspace

  let results = {
    createdRecord: null,
    errorMsg: null,
  };

  let childWsId = childFolder.workspace;

  let childPlain = childFolder.toObject();

  let fieldsToOmit = [
    '_id',
    'createDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'createdBy',
    'workspace'
  ];

  let childCopy = _.omit(childPlain, fieldsToOmit);

  childCopy.lastModifiedBy = userId;
  childCopy.lastModifiedDate = new Date();
  childCopy.createdBy = userId;
  childCopy.workspace = parentWorkspace._id;
  childCopy.originalFolder = childFolder._id;
  childCopy.owner = userId;

  let isTopLevel = isNil(childCopy.parent);

  if (isTopLevel) {
    // need to set parent as the 'workspace' folder
    let childWsFolder = _.find(parentWorkspace.folders, f => {
      return areObjectIdsEqual(f.srcChildWs, childWsId);
    });

    if (!childWsFolder) {
      // should never happen
      results.errorMsg = `Could not find default child workspace folder in parent workspace ${parentWorkspace._id} for child folder ${childFolder._id}`;
      return results;
    }
    childCopy.parent = childWsFolder;
  } else {
    // find corresponding parent folder in parent ws
    let parentWsParent = _.find(parentWorkspace.folders, f => {
      return areObjectIdsEqual(f.originalFolder, childCopy.parent);
    });

    if (!parentWsParent) {
      // should never happen
      results.errorMsg = `Could not find corresponding parent folder in parent workspace ${parentWorkspace._id} for child folder ${childFolder._id}`;
      return results;
    }
    childCopy.parent = parentWsParent;
  }

  return models.Folder.create(childCopy)
    .then((folder) => {
      results.createdRecord = folder;
      return results;
    })
    .catch((err) => {
      throw(err);
    });
};

const updateTaggings = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any taggings that parent ws doesnt have

  let childWsTaggingIds = parentWs.taggings.map(tagging => {
    return tagging.originalTagging;
  });


  let taggingFilter = {
    workspace: { $in: childWorkspaces },
    isTrashed: false // dont want to create a parent copy for a child record that was trashed
  };

  let updatedTaggings = [];

  if (isNonEmptyArray(childWsTaggingIds)) {
    taggingFilter._id = { $nin: childWsTaggingIds };

    updatedTaggings = await Promise.all(
      parentWs.taggings.map(async parentTaggingId => {
        let parentTagging = await models.Tagging.findById(
          parentTaggingId
        ).populate('originalTagging');

        if (!parentTagging) {
          // nonexistant id, remove from workspace?
          // shouldn't happen unless something went wrong
          let errorMsg = `Parent workspace ${parentWs._id} contains a nonexistant tagging ${parentTaggingId}`;

          logger.error(errorMsg);

          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: errorMsg
          };
        }

        if (!parentTagging.originalTagging) {
          let errorMsg = null;
          if (parentTagging.isDefaultTagging) {
            errorMsg = 'Default tagging; no need to check for updates';
            logger.info(errorMsg);
          } else {
            errorMsg = `Parent workspace ${parentWs._id} contains a non default tagging ${parentTaggingId} that is missing its original tagging reference`;
            logger.error(errorMsg);
          }
          return {
            didUpdate: false,
            updatedRecord: null,
            modifiedFields: [],
            errorMsg: errorMsg
          };
        }

        let childTagging = parentTagging.originalTagging;

        // determine if fields were modified. for now just do isTrashed
        let modifiedFields = [];
        if (childTagging.isTrashed !== parentTagging.isTrashed) {
          modifiedFields.push('isTrashed');
        }

        if (modifiedFields.length > 0) {
          return updateParentRecord(
            userId,
            parentTagging.originalTagging,
            'tagging',
            modifiedFields
          );
        }
        return {
          didUpdate: false,
          updatedRecord: null,
          modifiedFields: [],
          errorMsg: 'No modified fields to update'
        };
      })
    );
  }

  let childTaggings = await models.Tagging.find(taggingFilter);
  let createdTaggings = await Promise.all(
    childTaggings.map(childTagging => {
      return createParentTaggingCopy(userId, childTagging, parentWs);
    })
  );
  return [ createdTaggings, updatedTaggings];
};

const createParentTaggingCopy = (userId, childTagging, parentWorkspace) => {
  // expect childTagging to be a mongoose document
  // expect parentWorkspace to be populated workspace

  let results = {
    createdRecord: null,
    errorMsg: null,
  };

  let childPlain = childTagging.toObject();

  let fieldsToOmit = [
    '_id',
    'createDate',
    'lastModifiedDate',
    'lastModifiedBy',
    'createdBy',
    'workspace'
  ];

  let childCopy = _.omit(childPlain, fieldsToOmit);

  childCopy.lastModifiedBy = userId;
  childCopy.lastModifiedDate = new Date();
  childCopy.createdBy = userId;
  childCopy.workspace = parentWorkspace._id;
  childCopy.originalTagging = childTagging._id;

  if (isValidMongoId(childCopy.folder)) {
    // find corresponding folder in parent ws
    let parentWsFolder = _.find(parentWorkspace.folders, f => {
      return areObjectIdsEqual(f.originalFolder, childCopy.folder);
    });

    if (!parentWsFolder) {
      // should never happen
      results.errorMsg = `Could not find corresponding parent folder in parent workspace ${parentWorkspace._id} for child tagging ${childTagging._id}`;
      return results;
    }
    childCopy.folder = parentWsFolder._id;
  }

  // find corresponding selection in parentWs

  let parentSelection = _.find(parentWorkspace.selections, s => {
    return areObjectIdsEqual(s.originalSelection, childCopy.selection);
  });

  if (!parentSelection) {
    // should never happen
    results.errorMsg = `Could not find corresponding parent selection in parent workspace ${parentWorkspace._id} for child tagging ${childTagging._id}`;
    return results;
  }
  childCopy.selection = parentSelection._id;

  return models.Tagging.create(childCopy)
    .then(tagging => {
      results.createdRecord = tagging;
      return results;
    })
    .catch(err => {
      throw err;
    });
};

const updateParentWorkspace = async (
  user,
  popWorkspace,
  updateWorkspaceRequest
) => {
  try {
    // update submissions
    let { childWorkspaces } = popWorkspace;

    let didUpdate = false;

    let [ createdSubmissionsResults, updatedSubmissionsResults ] = await updateSubmissions(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    let createdSubmissions = createdSubmissionsResults
      .filter(obj => obj.createdRecord)
      .map(obj => obj.createdRecord);

    let updatedSubmissions = updatedSubmissionsResults.filter(obj => {
      return obj.didUpdate && obj.updatedRecord;
    });


    popWorkspace.submissions = popWorkspace.submissions.concat(
      _.compact(createdSubmissions)
    );

    let [ createdSelectionsResults, updatedSelectionsResults ] = await updateSelections(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    let createdSelections = createdSelectionsResults
      .filter(obj => obj.createdRecord)
      .map(obj => obj.createdRecord);

    let updatedSelections = updatedSelectionsResults.filter(obj => {
      return obj.didUpdate && obj.updatedRecord;
    });

    popWorkspace.selections = popWorkspace.selections.concat(
      _.compact(createdSelections)
    );

    let [ createdCommentsResults, updatedCommentsResults ] = await updateComments(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    let createdComments = createdCommentsResults
      .filter(obj => obj.createdRecord)
      .map(obj => obj.createdRecord);

    let updatedComments = updatedCommentsResults.filter(obj => {
      return obj.didUpdate && obj.updatedRecord;
    });

    popWorkspace.comments = popWorkspace.comments.concat(
      _.compact(createdComments)
    );

    let [ createdResponsesResults, updatedResponsesResults ] = await updateResponses(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    let createdResponses = createdResponsesResults
      .filter(obj => obj.createdRecord)
      .map(obj => obj.createdRecord);

    let updatedResponses = updatedResponsesResults.filter(obj => {
      return obj.didUpdate && obj.updatedRecord;
    });

    popWorkspace.responses = popWorkspace.responses.concat(
      _.compact(createdResponses)
    );

    let [ createdFoldersResults, updatedFoldersResults ] = await updateFolders(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    let createdFolders = createdFoldersResults
      .filter(obj => obj.createdRecord)
      .map(obj => obj.createdRecord);

    let updatedFolders = updatedFoldersResults.filter(obj => {
      return obj.didUpdate && obj.updatedRecord;
    });

    popWorkspace.folders = popWorkspace.folders.concat(
      _.compact(createdFolders)
    );

    let [ createdTaggingsResults, updatedTaggingsResults ] = await updateTaggings(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    let createdTaggings = createdTaggingsResults
      .filter(obj => obj.createdRecord)
      .map(obj => obj.createdRecord);

    let updatedTaggings = updatedTaggingsResults.filter(obj => {
      return obj.didUpdate && obj.updatedRecord;
    });

    popWorkspace.taggings = popWorkspace.taggings.concat(
      _.compact(createdTaggings)
    );

    if (isNonEmptyArray(createdSubmissions)) {
      didUpdate = true;
      updateWorkspaceRequest.createdParentData.submissions = createdSubmissions.map(
        submission => submission._id
      );
    }

    if (isNonEmptyArray(createdSelections)) {
      didUpdate = true;
      updateWorkspaceRequest.createdParentData.selections = createdSelections.map(
        selection => selection._id
      );
    }

    if (isNonEmptyArray(createdComments)) {
      didUpdate = true;
      updateWorkspaceRequest.createdParentData.comments = createdComments.map(
        comment => comment._id
      );
    }

    if (isNonEmptyArray(createdResponses)) {
      didUpdate = true;
      updateWorkspaceRequest.createdParentData.responses = createdResponses.map(
        response => response._id
      );
    }

    if (isNonEmptyArray(createdFolders)) {
      didUpdate = true;
      updateWorkspaceRequest.createdParentData.folders = createdFolders.map(
        folder => folder._id
      );
    }

    if (isNonEmptyArray(createdTaggings)) {
      didUpdate = true;
      updateWorkspaceRequest.createdParentData.taggings = createdTaggings.map(
        tagging => tagging._id
      );
    }

    if (isNonEmptyArray(updatedSubmissions)) {
      didUpdate = true;

      updateWorkspaceRequest.updatedParentData.submissions = updatedSubmissions.map(
        obj => {
          let isTrashed = obj.updatedRecord.isTrashed;
          let didIsTrashedChange = obj.modifiedFields.includes('isTrashed');

          return {
            recordId: obj.updatedRecord._id,
            updatedFields: obj.modifiedFields,
            wasJustTrashed: didIsTrashedChange && isTrashed,
            wasJustRestored: didIsTrashedChange && !isTrashed
          };
        }
      );
    }
    if (isNonEmptyArray(updatedSelections)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.selections = updatedSelections.map(
        obj => {
          let isTrashed = obj.updatedRecord.isTrashed;
          let didIsTrashedChange = obj.modifiedFields.includes('isTrashed');

          logger.debug(`Updated selection isTrashed value: `, obj.isTrashed);
          return {
            recordId: obj.updatedRecord._id,
            updatedFields: obj.modifiedFields,
            wasJustTrashed: didIsTrashedChange && isTrashed,
            wasJustRestored: didIsTrashedChange && !isTrashed
          };
        }
      );
    }

    if (isNonEmptyArray(updatedComments)) {
      didUpdate = true;

      updateWorkspaceRequest.updatedParentData.comments = updatedComments.map(
        obj => {
          let isTrashed = obj.updatedRecord.isTrashed;
          let didIsTrashedChange = obj.modifiedFields.includes('isTrashed');

          return {
            recordId: obj.updatedRecord._id,
            updatedFields: obj.modifiedFields,
            wasJustTrashed: didIsTrashedChange && isTrashed,
            wasJustRestored: didIsTrashedChange && !isTrashed
          };
        }
      );
    }

    if (isNonEmptyArray(updatedResponses)) {
      didUpdate = true;

      updateWorkspaceRequest.updatedParentData.responses = updatedResponses.map(
        obj => {
          let isTrashed = obj.updatedRecord.isTrashed;
          let didIsTrashedChange = obj.modifiedFields.includes('isTrashed');

          return {
            recordId: obj.updatedRecord._id,
            updatedFields: obj.modifiedFields,
            wasJustTrashed: didIsTrashedChange && isTrashed,
            wasJustRestored: didIsTrashedChange && !isTrashed
          };
        }
      );
    }

    if (isNonEmptyArray(updatedFolders)) {
      didUpdate = true;

      updateWorkspaceRequest.updatedParentData.folders = updatedFolders.map(
        obj => {
          let isTrashed = obj.updatedRecord.isTrashed;
          let didIsTrashedChange = obj.modifiedFields.includes('isTrashed');

          return {
            recordId: obj.updatedRecord._id,
            updatedFields: obj.modifiedFields,
            wasJustTrashed: didIsTrashedChange && isTrashed,
            wasJustRestored: didIsTrashedChange && !isTrashed
          };
        }
      );
    }

    if (isNonEmptyArray(updatedTaggings)) {
      didUpdate = true;

      updateWorkspaceRequest.updatedParentData.taggings = updatedTaggings.map(
        obj => {
          let isTrashed = obj.updatedRecord.isTrashed;
          let didIsTrashedChange = obj.modifiedFields.includes('isTrashed');

          return {
            recordId: obj.updatedRecord._id,
            updatedFields: obj.modifiedFields,
            wasJustTrashed: didIsTrashedChange && isTrashed,
            wasJustRestored: didIsTrashedChange && !isTrashed
          };
        }
      );
    }
    updateWorkspaceRequest.wasNoDataToUpdate = !didUpdate;
    await updateWorkspaceRequest.save();

    return updateWorkspaceRequest;
  } catch (err) {
    logger.error('updateParentWorkspace error: ', err);
  }
};

const updateParentRecord = async (userId, childRecord, recordType, modifiedFields) => {
  let results = {
    didUpdate: false,
    updatedRecord: null,
    modifiedFields: [],
    errorMsg: null,
  };
  try {
    let capRecordType = capitalizeWord(recordType);
    let originalRecordPropName = `original${capRecordType}`;

    let parentCriteria = {
      [originalRecordPropName]: childRecord._id
    };

    let parentRecord = await models[capRecordType].findOne(parentCriteria);

    if (!parentRecord) {
      results.errorMsg = `Could not find a parent ${recordType} associated with child id ${childRecord._id}`;
      return results;
    }

    if (isNonEmptyArray(modifiedFields)) {
      let simpleFields = [...modifiedFields];

      if (recordType === 'folder') {
        if (modifiedFields.includes('children')) {
          parentRecord.children = await mapFolderChildren(childRecord);
          simpleFields = _.reject(simpleFields, (field => field === 'children'));
        }

        if (modifiedFields.includes('parent')) {
          parentRecord.parent = await mapFolderParent(childRecord, parentRecord.workspace);
          simpleFields = _.reject(simpleFields, (field => field === 'parent'));
        }
      } else if (recordType === 'comment') {
        if (modifiedFields.includes('children')) {
          parentRecord.children = await mapCommentChildren(childRecord, parentRecord.workspace);
          simpleFields = _.reject(simpleFields, (field => field === 'children'));
        }

        if (modifiedFields.includes('parent')) {
          parentRecord.parent = await mapCommentParent(childRecord, parentRecord.workspace);
          simpleFields = _.reject(simpleFields, (field => field === 'parent'));
        }
        if (modifiedFields.includes('ancestors')) {
          parentRecord.ancestors = await mapCommentAncestors(childRecord, parentRecord.workspace);
          simpleFields = _.reject(simpleFields, (field => field === 'ancestors'));
        }
      } else if (recordType === 'response') {
        if (modifiedFields.includes('priorRevision')) {
          parentRecord.parent = await mapResponsePriorRevision(childRecord);
          simpleFields = _.reject(simpleFields, field => field === 'priorRevision');
        }

        if (modifiedFields.includes('reviewdResponse')) {
          parentRecord.parent = await mapResponseReviewedResponse(childRecord);
          simpleFields = _.reject(simpleFields, field => field === 'reviewedResponse');
        }
      }

      simpleFields.forEach(field => {
        parentRecord[field] = childRecord[field];
      });

        parentRecord.lastModifiedBy = userId;
        parentRecord.lastModifiedDate = new Date();

        await parentRecord.save();

        results.didUpdate = true;
        results.modifiedFields = modifiedFields;
        results.updatedRecord = parentRecord;

        return results;
    } else {
      // initiated by updateSubmission
      // needs to be refactored
      let results = {
        didUpdate: false,
        updatedRecord: null,
        modifiedFields: [],
        errorMsg: null
      };
      return results;
    }

  }catch(err) {
    throw(err);
  }
};

const resolveParentUpdates = async (userId, childRecord, childRecordType, modificationType, modifiedFields, options = {}) => {
  // this function will run after a record related to a workspace has been saved and response sent
  // any errors will be passed to express next function

  // check for parentWorkspaces first
  try {

  if (!isValidMongoId(userId)) {
    throw new Error(`Invalid userId in resolveParentUpdates: ${userId}`);
  }

  if (!isValidMongoId(_.propertyOf(childRecord)('_id'))) {
    throw new Error(`Invalid childRecord in resolveParentUpdates: ${childRecord}`);
  }

  let allowedModificationTypes = ['create', 'trash', 'update'];

  let allowedChildRecordTypes = ['submission', 'selection', 'comment', 'response', 'folder', 'tagging'];

  if (!allowedModificationTypes.includes(modificationType)) {
    throw new Error(`Invalid modificationType in resolveParentUpdates: ${modificationType}`);
  }

  if (!allowedChildRecordTypes.includes(childRecordType)) {
    throw new Error(`Invalid childRecordType in resolveParentUpdates: ${childRecordType}`);
  }

  let workspaceId = childRecordType === 'submission' ? childRecord.workspaces[0] : childRecord.workspace;

  let parentCriteria = {
    isTrashed: false,
    workspaceType: 'parent',
    childWorkspaces: workspaceId,
    doAutoUpdateFromChildren: true,
  };

  let parentWorkspacePopulationHash = {
    selection: 'submissions folders',
    comment: 'comments submissions selections',
    response: 'comments submissions selections',
    folder: 'folders',
    tagging: 'folders submissions selections',
  };

  let popOpts = parentWorkspacePopulationHash[childRecordType];

  let parentWorkspacesToUpdate = await models.Workspace.find(parentCriteria).populate(popOpts).exec();

  if (!isNonEmptyArray(parentWorkspacesToUpdate)) {
    // no workspaces to update
    // logger.info(`No parent workspaces to update for ${childRecordType} ${childRecord}`);
    return [];
  }

  if (modificationType === 'update') {
    let updateParentRecordResults = await updateParentRecord(userId, childRecord, childRecordType, modifiedFields);

    return updateParentRecordResults;

  }


  let copyHandlerHash = {
    submission: {
      create: createParentSubmissionCopy,
    },
    selection: {
      create: createParentSelectionCopy,
    },
    comment: {
      create: createParentCommentCopy,
    },
    response: {
      create: createParentResponseCopy,
    },
    folder: {
      create: createParentFolderCopy,
    },
    tagging: {
      create: createParentTaggingCopy,
    },
  };

  let updatedRecords = parentWorkspacesToUpdate.map((parentWorkspace) => {
    let handler = copyHandlerHash[childRecordType][modificationType];

    return handler(userId, childRecord, parentWorkspace);
  });

  return Promise.all(updatedRecords)
  .then((updatedRecordResults) => {
    // create workspaceUpdateEvent record
    return updatedRecordResults;
  });
}catch(err) {
  throw(err);
}

};

module.exports.generateParentWorkspace = generateParentWorkspace;
module.exports.post.parentWorkspace = postParentWorkspace;
module.exports.updateParentWorkspace = updateParentWorkspace;
module.exports.resolveParentUpdates = resolveParentUpdates;