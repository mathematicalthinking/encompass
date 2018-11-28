const models = require('../datasource/schemas');
const _ = require('underscore');

const collections = ["Tagging",
"Folder",
"Workspace",
"Selection",
"Submission",
"Comment",
"Response",
"User",
"Problem",
"Answer",
"Section",
"Category"
];
// Criteria for deciding which workspaces to keep
// Current buildCriteria function uses greater than these values
const workspaceMinimum = {
  submissions: 3,
  comments: 0,
  taggings: 0,
  folders: 3,
  selections: 0
};

// builds the criteria that will be passed to the find operation
function buildCriteria(options) {
  let $andArray = [];
  const keys = Object.keys(options);
  for (let key of keys) {
    let minValue = options[key];
    let criteria = {$where: `this.${key} && this.${key}.length > ${minValue}`};
    $andArray.push(criteria);
  }
  return {$and: $andArray};
}

// finds matching workspaces based on criteria and then deletes
// all other workspaces that don't match
async function pruneWorkspaces() {
  let workspaces;
  let ids;
  let deleted;
  try {
    workspaces = await models.Workspace.find(buildCriteria(workspaceMinimum));
    console.log('matching workspaces', workspaces.length);
    ids = workspaces.map(ws => ws._id);
    deleted = await models.Workspace.deleteMany({_id: {$nin: ids}});
  }catch(err) {
    console.log(err);
  }
  return deleted;
}
// removes all documents from specified collectiond
async function removeTrashedDocuments() {
  let trashed;
  try {
    for (let collection of collections) {
      let model = models[collection];
      trashed = await model.deleteMany({isTrashed: true});
    }
}catch(err) {
  console.log(err);
}
  return trashed;
}

// collections where the schema has a workspace field which contains a single
// reference to a workspace ObjectId
const belongsToWs = ['Selection', 'Comment', 'Response', 'Folder'];

// removes all documents whose workspace field references a workspace
// ObjectId that no longer exists in database
async function removeOrphanedFromWs(collection) {
  let deleted = 0;
  let model = models[collection];
  try {
    let allDocs = await model.find({});
    console.log(`There are ${allDocs.length} ${collection}s`);

    for (let doc of allDocs) {
      let shouldDelete = true;
      let wsId = doc.workspace;
      if (wsId) {
        let ws = await models.Workspace.findById(wsId);
        if (ws !== null && ws !== undefined) {
          shouldDelete = false;
        }
      }
       if (shouldDelete) {
          await model.deleteOne({_id: doc._id});
          deleted++;
        }
      }
    }catch(err) {
      console.log(err);
  }

  console.log(`Deleted ${deleted} ${collection}s`);
  return deleted;
}

async function removeAllOrphanedFromWs() {
  for (let collection of belongsToWs) {
    await removeOrphanedFromWs(collection);
  }
  return;
}

// Removes all taggings that contian a reference to a selection or folder
// that no longer exist
async function removeOrphanedTaggings() {
  let deleted = 0;
  let model = models.Tagging;
  try {
    let taggings = await model.find({});
    console.log(`there are ${taggings.length} taggings`);

    for (let tagging of taggings) {
      let shouldDelete = true;
      let selectionId = tagging.selection;
      let folderId = tagging.folder;

      if (selectionId && folderId) {
        let selection = await models.Selection.findById(selectionId);
        let folder = await models.Folder.findById(folderId);

        if (selection !== null && folder !== null) {
          shouldDelete = false;
        }

        if(shouldDelete) {
          await model.deleteOne({_id: tagging._id});
          deleted++;
        }
      }
    }
  }catch(err) {
    console.log(err);
  }
  console.log(`deleted ${deleted} taggings`);
  return deleted;
}
// removes all orphaned workspaceIds from submissions
async function removeOrphanedWorkspaces() {
  let results;
  try {
    let workspaces = await models.Workspace.find({});
    let workspaceIds = workspaces.map(ws => ws._id);
    results = await models.Submission.updateMany({}, {$pull: {workspaces: {$nin: workspaceIds}}});
  }catch(err) {
    console.log(err);
  }
  console.log('results for removing Orphaned workspaces',results);
  return results;
}

// submissions contain a workspaces field which is an array
// of workspace ObjectId references
// deletes submissions that contain a reference to deleted workspaces
// otherwise app throws an error when navigating in the workspace
async function removeOrphanedSubs() {
  let deleted = 0;
  let model = models.Submission;
  try {
    let subs = await model.find({});
    console.log(`There are ${subs.length} submissions`);

    for (let sub of subs) {
      let shouldDelete = true;
      let wsIds = sub.workspaces;
      if (wsIds) {
        for (let id of wsIds) {
          let ws = await models.Workspace.findById(id);
          if (ws !== null) {
            shouldDelete = false;
          }
        }
      }
      if (shouldDelete) {
        await model.deleteOne({_id: sub._id});
        deleted++;
      }
    }
  }catch(err) {
    console.log(err);
  }

  console.log(`Deleted ${deleted} submissionss`);
}

// remove all users that are not admins or that are not owners or editors
// of existing workspaces
async function removeIrrelevantUsers() {
  let deleted;
  let model = models.User;
  try {
    let regularUsers = await model.find({isAdmin: {$ne: true}});
    let admins = await model.find({isAdmin: true});
    let relevantUserIds = [];
    console.log(`there are ${regularUsers.length} regular users`);
    console.log(`there are ${admins.length} admins`);

    let workspaces = await models.Workspace.find({});
    for (let ws of workspaces) {
      let ownerId = ws.owner;
      let editorIds = ws.editors;
      console.log(typeof ownerId);

      if (ownerId) {
        relevantUserIds.push(ownerId);
      }
      if(editorIds) {
        relevantUserIds = relevantUserIds.concat(editorIds);
      }
    }
    relevantUserIds = _.uniq(relevantUserIds);
    console.log('relevant users: ',relevantUserIds.length);
    deleted = await model.deleteMany({_id: {$nin: relevantUserIds}, isAdmin: {$ne:true}});

  }catch(err) {
    console.log(err);
  }
  return deleted;
}
async function cleaner() { // eslint-disable-line no-unused-vars
  try {
    await removeTrashedDocuments();
    await pruneWorkspaces();
    await removeOrphanedSubs();
    await removeAllOrphanedFromWs();
    await removeOrphanedTaggings();
    await removeIrrelevantUsers();
    await removeOrphanedWorkspaces();
  }catch(err) {
    console.log(err);
  }
  console.log('done!');
}
//cleaner();
