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

const targetWorkspaces = ['']
const workspaceMinimum = {
  submissions: 3, 
  comments: 0, 
  taggings: 0,
  folders: 3, 
  selections: 0
}

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
console.log(buildCriteria(workspaceMinimum));

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
    console.log(err)
  }
  return deleted;
}
//pruneWorkspaces();
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

const belongsToWs = ['Selection', 'Comment', 'Response', 'Folder']
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
}

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

async function removeOrphanedTaggings() {
  let deleted = 0;
  let model = models.Tagging;
  try {
    let taggings = await model.find({});
    console.log(`there are ${taggings.length} taggings`);

    for (tagging of taggings) {
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
}

async function removeAllOrphanedFromWs() {
  for (let c of belongsToWs) {
    await removeOrphanedFromWs(c);
  }
  return;
}

async function removeOrphanedWorkspaces() {
  let results;
  try {
    //let submissions = await models.Submission.find({});
    let workspaces = await models.Workspace.find({});
    let workspaceIds = workspaces.map(ws => ws._id);
    console.log(workspaceIds);
    results = await models.Submission.updateMany({}, {$pull: {workspaces: {$nin: workspaceIds}}});
  }catch(err) {
    console.log(err);
  }
  console.log('results for removing Orphaned workspaces',results);
  return results;
}

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
async function cleaner() {
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
