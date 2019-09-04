/* eslint-disable no-use-before-define */
const _ = require('underscore');
const logger = require('log4js').getLogger('server');

const models = require('../schemas');
const { isNonEmptyArray, isNil } = require('../../utils/objects');
const { isValidMongoId, areObjectIdsEqual } = require('../../utils/mongoose');

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
      populate: { path: 'answer', populate: answerOptions }
    })
    .populate('selections')
    .populate('comments')
    .populate({ path: 'folders', populate: 'taggings' })
    .populate('taggings')
    .populate('responses')
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

          acc.oldToNewMap.selection[oldId] = newSelection._id;

          let isNotTagged = !isNonEmptyArray(newSelection.taggings);

          if (isNotTagged) {
            let defTagging = new models.Tagging({
              selection: newSelection._id,
              folder: newParentFolder._id,
              workspace: parentId,
              createdBy: newSelection.createdBy,
              createDate: newSelection.createDate,
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
          let newComment = new models.Comment(oldComment);

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
            newParentFolder.children.push(oldId);
          }
          oldFolder.originalFolder = oldId;
          let newFolder = new models.Folder(oldFolder);

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
          let newResponse = new models.Response(oldResponse);

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

const combineSubmissions = workspaces => {
  let oldToNewMap = {};

  let submissionHash = workspaces.reduce((acc, workspace) => {
    let submissions = workspace.submissions || [];
    submissions.forEach(submission => {
      let answer = submission.answer;
      if (!acc[answer._id]) {
        let oldId = submission._id;
        delete submission._id;

        submission.answer = answer._id;
        submission.originalSubmission = oldId;
        let newSubmission = new models.Submission(submission);
        oldToNewMap[oldId] = newSubmission._id;
        acc[answer._id] = newSubmission;
      } else {
        // take markup from this submission and add to
        acc[answer._id].selections = acc[answer._id].selections.concat(
          submission.selections
        );

        acc[answer._id].comments = acc[answer._id].comments.concat(
          submission.comments
        );

        acc[answer._id].responses = acc[answer._id].responses.concat(
          submission.responses
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
      return oldToNewMap.comment[ancestor];
    });

    comment.children = comment.children.map(child => {
      // ancestor is objectId
      return oldToNewMap.comment[child];
    });

    comment.submission = subOldToNewMap[comment.submission];
    comment.selection = oldToNewMap.selection[comment.selection];
    comment.parent = oldToNewMap.comment[comment.parent];
    comment.workspace = parentWs._id;

    return comment;
  });

  combinedWorkspace.folders = combinedWorkspace.folders.map(folder => {
    folder.children = folder.children.map(child => {
      return oldToNewMap.folder[child];
    });

    if (folder.parent && oldToNewMap.folder[folder.parent]) {
      // we do not want to update the parent of folders that were previously top level

      folder.parent = oldToNewMap.folder[folder.parent];
      folder.taggings = folder.taggings.map(tagging => {
        return oldToNewMap.tagging[tagging];
      });
      folder.workspace = parentWs._id;
    }

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
    workspaces: { $elemMatch: { $in: childWorkspaces } }
  };

  if (isNonEmptyArray(parentWsAnswerIds)) {
    subFilter.answer = { $nin: parentWsAnswerIds };
  }

  let childSubmissions = await models.Submission.find(subFilter).populate(
    'answer'
  );

  return Promise.all(
    childSubmissions.map(childSubmission => {
      return createParentSubmissionCopy(userId, childSubmission, parentWs._id);
    })
  );
};

const createParentSubmissionCopy = (
  userId,
  childSubmission,
  parentWorkspace
) => {
  // expect childSubmission to be a mongoose document
  // expect parentWorkspaceId to be populatedWorkspace

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

  return models.Submission.create(childCopy);
};

const createParentSelectionCopy = async (userId, childSelection, parentWorkspace) => {
  // expect childSelection to be a mongoose document
  // expect parentWorkspaceId to be populated workspace
  try {
    logger.info('starting create parent sel copy');
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
      logger.error('selection missing submission');
      return;
    }


    childCopy.submission = parentSub._id;

    // new selection will not have any comments

    // new selection will never have taggings
    // create default tagging for default workspace folder

    return models.Selection.create(childCopy)
      .then((selection) => {
        let parentFolder = _.find(parentWorkspace.folders, (popFolder) => {
          return areObjectIdsEqual(popFolder.srcChildWs, originalWorkspaceId);
        });
        logger.info('parentFolder', parentFolder);
        if (!parentFolder) {
          // should never happen
          logger.info('missing default workspace folder');
          return;
        }
        return models.Tagging.create({
          selection: selection._id,
          folder: parentFolder._id,
          workspace: parentWorkspace._id,
          createdBy: userId,
          lastModifiedBy: userId,
          lastModifiedDate: new Date()
        })
          .then((tagging) => {
            selection.taggings = [ tagging._id ];
            selection.lastModifiedDate = new Date();
            return selection.save();
          });
      });
  }catch(err) {
    logger.error(err);
  }

};

const updateSelections = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any selections that parent ws doesnt have
  // or if folders were deleted from child workspaces

  let parentWsSelectionIds = parentWs.selections.map(selection => {
    return selection.originalSelection;
  });

  let selectionFilter = {
    workspace: { $in: childWorkspaces }
  };

  if (isNonEmptyArray(parentWsSelectionIds)) {
    selectionFilter._id = { $nin: parentWsSelectionIds };
  }

  let childSelections = await models.Selection.find(selectionFilter).populate(
    'submission'
  );

  return Promise.all(
    childSelections.map(childSelection => {
      return createParentSelectionCopy(userId, childSelection, parentWs);
    })
  );
};

const createParentCommentCopy = async (userId, childComment, parentWorkspace) => {
  // expect childComment to be a mongoose document
  // expect parentWorkspaceId to be populated workspace
  try {
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
      logger.error('comment missing submission');
      return;
    }
    childCopy.submission = parentSub._id;

    if (isValidMongoId(childCopy.parent)) {
      // find corresponding parent comment in parent ws
      let parentWsParent = _.find(parentWorkspace.comments, c => {
        return areObjectIdsEqual(c.originalComment, childCopy.parent);
      });

      if (!parentWsParent) {
        // should never happen
        logger.info('comment missing parentws parent');
        return;
      }
      childCopy.parent = parentWsParent._id;
    }

    if (isNonEmptyArray(childCopy.ancestors)) {
      childCopy.ancestors = childCopy.ancestors.map(ancestor => {
        // find this ancestor comment in parent ws
        let parentWsAncestor = _.find(parentWorkspace.comments, c => {
          return areObjectIdsEqual(c.originalComment, ancestor);
        });

        if (!parentWsAncestor) {
          // should never happen
          logger.info('comment missing parentws ancestor');
          return;
        }
        return ancestor;
      });

      childCopy.ancestors = _.compact(childCopy.ancestors);
    }

    // find corresponding selection in parentWs

    let parentSelection = _.find(parentWorkspace.selections, s => {
      return areObjectIdsEqual(s.originalSelection, childCopy.selection);
    });

    if (!parentSelection) {
      // should never happen
      logger.info('missing parent selection');
      return;
    }
    childCopy.selection = parentSelection._id;

    return models.Comment.create(childCopy);

  }catch(err) {
    logger.error(err);
  }
};

const updateComments = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any comments that parent ws doesnt have

  let parentWsCommentIds = parentWs.comments.map(comment => {
    return comment.originalComment;
  });

  let commentFilter = {
    workspace: { $in: childWorkspaces }
  };

  if (isNonEmptyArray(parentWsCommentIds)) {
    commentFilter._id = { $nin: parentWsCommentIds };
  }

  let childComments = await models.Comment.find(commentFilter).populate(
    'submission'
  );

  return Promise.all(
    childComments.map(childComment => {
      return createParentCommentCopy(userId, childComment, parentWs);
    })
  );
};

const updateResponses = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any comments that parent ws doesnt have

  let parentWsResponseIds = parentWs.responses.map(response => {
    return response.originalResponse;
  });

  let responseFilter = {
    workspace: { $in: childWorkspaces }
  };

  if (isNonEmptyArray(parentWsResponseIds)) {
    responseFilter._id = { $nin: parentWsResponseIds };
  }

  let childResponses = await models.Response.find(responseFilter).populate(
    'submission'
  );

  return Promise.all(
    childResponses.map(childResponse => {
      return createParentResponseCopy(userId, childResponse, parentWs);
    })
  );
};

const createParentResponseCopy = async (userId, childResponse, parentWorkspace) => {
  // expect childResponse to be a mongoose document
  // expect parentWorkspace to be populated workspace
  try {
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
      logger.error('response missing submission');
      return;
    }
    childCopy.submission = parentSub._id;

    if (isValidMongoId(childCopy.priorRevision)) {
      // find corresponding revision in parent ws
      let parentWsRevision = _.find(parentWorkspace.responses, r => {
        return areObjectIdsEqual(r.originalResponse, childCopy.priorRevision);
      });

      if (!parentWsRevision) {
        // should never happen
        logger.info('missing parentws response priorRevision');
        return;
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
        logger.info('missing parentws response reviewedResponse');
        return;
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
          logger.info('missing parentws  response selections');
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
          logger.info('missing parentws response comments');
          return;
        }
        return comment;
      });

      childCopy.selections = _.compact(childCopy.selections);
    }

    return models.Response.create(childCopy);

  }catch(err) {
    logger.error(err);
  }
};

const updateFolders = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any folders that parent ws doesnt have

  let parentWsFolderIds = parentWs.folders.map(folder => {
    return folder.originalFolder;
  });

  let folderFilter = {
    workspace: { $in: childWorkspaces }
  };

  if (isNonEmptyArray(parentWsFolderIds)) {
    folderFilter._id = { $nin: parentWsFolderIds };
  }

  let childFolders = await models.Folder.find(folderFilter);

  return Promise.all(
    childFolders.map(childFolder => {
      return createParentFolderCopy(userId, childFolder, parentWs);
    })
  );
};

const createParentFolderCopy = (userId, childFolder, parentWorkspace) => {
  // expect childFolder to be a mongoose document
  // expect parentWorkspace to be populated workspace

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
      logger.info('missing child ws folder');
      return;
    }
    childCopy.parent = childWsFolder;
  } else {
    // find corresponding parent folder in parent ws
    let parentWsParent = _.find(parentWorkspace.folders, f => {
      return areObjectIdsEqual(f.originalFolder, childCopy.parent);
    });

    if (!parentWsParent) {
      // should never happen
      logger.info('missing parentws parent');
      return;
    }
    childCopy.parent = parentWsParent;
  }

  return models.Folder.create(childCopy);
};

const updateTaggings = async (userId, parentWs, childWorkspaces) => {
  // check if childWorkspaces have any taggings that parent ws doesnt have

  let parentWsTaggingIds = parentWs.taggings.map(tagging => {
    return tagging.originalTagging;
  });

  let taggingFilter = {
    workspace: { $in: childWorkspaces }
  };

  if (isNonEmptyArray(parentWsTaggingIds)) {
    taggingFilter._id = { $nin: parentWsTaggingIds };
  }

  let childTaggings = await models.Tagging.find(taggingFilter);

  return Promise.all(
    childTaggings.map(childTagging => {
      return createParentTaggingCopy(userId, childTagging, parentWs);
    })
  );
};

const createParentTaggingCopy = (userId, childTagging, parentWorkspace) => {
  // expect childTagging to be a mongoose document
  // expect parentWorkspace to be populated workspace

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
      logger.info('missing parentws parent');
      return;
    }
    childCopy.folder = parentWsFolder._id;
  }

  // find corresponding selection in parentWs

  let parentSelection = _.find(parentWorkspace.selections, s => {
    return areObjectIdsEqual(s.originalSelection, childCopy.selection);
  });

  if (!parentSelection) {
    // should never happen
    logger.info('missing parent selection');
    return;
  }
  childCopy.selection = parentSelection._id;

  return models.Tagging.create(childCopy);
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

    let createdSubmissions = await updateSubmissions(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    popWorkspace.submissions = popWorkspace.submissions.concat(
      createdSubmissions
    );

    let createdSelections = await updateSelections(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    popWorkspace.selections = popWorkspace.selections.concat(createdSelections);

    let createdComments = await updateComments(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    popWorkspace.comments = popWorkspace.comments.concat(createdComments);

    let createdResponses = await updateResponses(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    popWorkspace.responses = popWorkspace.responses.concat(createdResponses);

    let createdFolders = await updateFolders(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    popWorkspace.folders = popWorkspace.folders.concat(createdFolders);

    let createdTaggings = await updateTaggings(
      user._id,
      popWorkspace,
      childWorkspaces
    );

    popWorkspace.taggings = popWorkspace.taggings.concat(createdTaggings);

    if (isNonEmptyArray(createdSubmissions)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.submissions = createdSubmissions.map(
        submission => submission._id
      );
    }

    if (isNonEmptyArray(createdSelections)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.selections = createdSelections.map(
        selection => selection._id
      );
    }

    if (isNonEmptyArray(createdComments)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.comments = createdComments.map(
        comment => comment._id
      );
    }

    if (isNonEmptyArray(createdResponses)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.responses = createdResponses.map(
        response => response._id
      );
    }

    if (isNonEmptyArray(createdFolders)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.folders = createdFolders.map(
        folder => folder._id
      );
    }

    if (isNonEmptyArray(createdTaggings)) {
      didUpdate = true;
      updateWorkspaceRequest.updatedParentData.taggings = createdTaggings.map(
        tagging => tagging._id
      );
    }

    updateWorkspaceRequest.wasNoDataToUpdate = !didUpdate;

    return updateWorkspaceRequest;
  } catch (err) {
    logger.error('updateParentWorkspace error: ', err);
  }
};

const updateParentRecord = async (user, childRecord, recordType) => {
  try {
    let capRecordType = capitalizeWord(recordType);
    let originalRecordPropName = `original${capRecordType}`;

    let parentCriteria = {
      [originalRecordPropName]: childRecord._id
    };

    let parentRecord = await models[capRecordType].findOne(parentCriteria);

    if (!parentRecord) {
      return null;
    }

    let allowedFieldsHash = {
      selection : ['isTrashed', 'relativeCoords', 'relativeSize'],
      tagging: [ 'isTrashed' ],
      folder: [ 'isTrashed'],
      comment: ['isTrashed' ],
      response: ['isTrashed', 'status'],
    };

    let allowedFields = allowedFieldsHash[recordType];

    allowedFields.forEach((field) => {
      parentRecord[field] = childRecord[field];
    });
    parentRecord.lastModifiedBy = user._id;
    parentRecord.lastModifiedDate = new Date();

    return parentRecord.save();

  }catch(err) {
    logger.error(err);
  }
};

const resolveParentUpdates = async (user, childRecord, childRecordType, modificationType, next, options = {}) => {
  // this function will run after a record related to a workspace has been saved and response sent
  // any errors will be passed to express next function

  // check for parentWorkspaces first
  try {

  if (!isValidMongoId(_.propertyOf(user)('_id'))) {
    return next(new Error(`Invalid user in resolveParentUpdates: ${user}`));
  }

  if (!isValidMongoId(_.propertyOf(childRecord)('_id'))) {
    return next(new Error(`Invalid childRecord in resolveParentUpdates: ${childRecord}`));
  }

  let allowedModificationTypes = ['create', 'trash', 'update'];

  let allowedChildRecordTypes = ['submission', 'selection', 'comment', 'response', 'folder', 'tagging'];

  if (!allowedModificationTypes.includes(modificationType)) {
    return next(new Error(`Invalid modificationType in resolveParentUpdates: ${modificationType}`));
  }

  if (!allowedChildRecordTypes.includes(childRecordType)) {
    return next(new Error(`Invalid childRecordType in resolveParentUpdates: ${childRecordType}`));
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
    logger.info(`No parent workspaces to update for ${childRecordType} ${childRecord}`);
    return;
  }

  if (modificationType === 'update') {
    let updatedParentRecord = await updateParentRecord(user, childRecord, childRecordType);

    if (!updateParentRecord) {
      logger.info(`Could not find parent record for ${childRecord}`);
    }

    logger.info(`Successfully updated parent ${childRecordType} ${updatedParentRecord}}`);
    return;
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

    return handler(user._id, childRecord, parentWorkspace);
  });

  return Promise.all(updatedRecords)
  .then((updatedRecords) => {
    // create workspaceUpdateEvent record
    logger.info('successful update', updatedRecords);
  });
}catch(err) {
  logger.error(err);
  next(err);
}

};

module.exports.generateParentWorkspace = generateParentWorkspace;
module.exports.post.parentWorkspace = postParentWorkspace;
module.exports.updateParentWorkspace = updateParentWorkspace;
module.exports.resolveParentUpdates = resolveParentUpdates;