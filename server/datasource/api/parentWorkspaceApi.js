/* eslint-disable no-use-before-define */
const _ = require('underscore');

const models = require('../schemas');
const { isNonEmptyArray } = require('../../utils/objects');
const { isValidMongoId, } = require('../../utils/mongoose');

const { requireUser } = require('../../middleware/userAuth');

const { sendError, sendResponse } = require('../../middleware/requestHandler');

module.exports.post = {};

const generateParentWorkspace = async function(config) {
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
      return {
        parentWorkspace: null,
        errorMsg: 'No child workspaces provided'
      };
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
    return {
      parentWorkspace,
      errorMsg: null
    };
  } catch (err) {
    console.log({ generateParentWorkspaceErr: err });
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
    let { config } = req.body;
    let results = await generateParentWorkspace(config);

    let data = { results };

    return sendResponse(res, data);
  }catch(err) {
    console.log(`postParentWorkspace err: ${err}`);
    return sendError.InternalError(null, res);
  }
};

module.exports.generateParentWorkspace = generateParentWorkspace;
module.exports.post.parentWorkspace = postParentWorkspace;
