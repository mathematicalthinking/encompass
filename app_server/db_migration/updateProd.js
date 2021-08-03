var mongoose = require('mongoose');
const models = require('../datasource/schemas');
const _ = require('underscore');
mongoose.Promise = global.Promise;

const originalCollections = [
  "Comment",
  "Error",
  "Folder",
  "PDSubmission",
  "Response",
  "Selection",
  "Submission",
  "Tagging",
  "User",
  "Workspace"
];
const newCollections = [
  "Assignment",
  "Category",
  "Image",
  "Organization",
  "Problem",
  "Section"
];
const allCollections = originalCollections.concat(newCollections);


async function removeTrashedDocuments() {
  console.log(`Starting removeTrashedDocuments `)
  for (let collection of originalCollections) {
    let trashed;
    let model = models[collection];
    // let allDocs = await model.find({}).exec();
    // let allDocsIds = allDocs.map(ws => ws._id);
    // console.log(`There are ${allDocsIds.length} documents for ${collection}`)
    try {
      trashed = await model.deleteMany({isTrashed: true});
    } catch(e) {
      console.log(`deleteMany error: ${e}`);
    }
    console.log(`${model.modelName} deleted ${trashed.deletedCount} records`);
  }
  console.log(`done running remove Trashed Documents`);
  console.log(`-------------------`)
}


// removes all documents whose workspace field references a workspace
// ObjectId that no longer exists in database
async function removeOrphanedFromWs(collection, workspaceIds) {
  console.log(`Starting removeOrphanedFromWs for ${collection.name}`)
  let deleted = 0;
  let model = models[collection];
  // let mismatch = 0; // unused - is this necessary?

  let allDocs = await model.find({}).exec();
  try {

    for (let doc of allDocs) {
      let shouldDelete = false;
      let wsId = doc.workspace;
      if (wsId) {
        let ix = workspaceIds.indexOf(wsId);
        if (!ix) {
          shouldDelete = true;
        }
      }
      if (shouldDelete) {
        // await model.deleteOne({_id: doc._id});
        deleted++;
      }
    }
  }catch(err) {
    console.log(err);
  }

  console.log(`Deleted orphans count ${deleted} of ${allDocs.length} for ${collection}s`);
  console.log(`-------------------`)
  return deleted;
}


// Removes all taggings that contian a reference to a selection or folder
// that no longer exist
async function removeOrphanedTaggings() {
  console.log(`Starting removeOrphanedTaggings`)
  let deleted = 0;
  let tags = models.Tagging;
  try {
    let taggings = await tags.find({}).exec();
    console.log(`there are ${taggings.length} taggings`);

    for (let tagging of taggings) {
      let shouldDelete = true;
      let selectionId = tagging.selection;
      let folderId = tagging.folder;

      if (selectionId && folderId) {
        let selection = await models.Selection.findById(selectionId).exec();
        let folder = await models.Folder.findById(folderId).exec();

        if (selection !== null && folder !== null) {
          shouldDelete = false;
      }

        if(shouldDelete) {
          await tags.deleteOne({_id: tagging._id});
          deleted++;
        }
      }
    }
  }catch(err) {
    console.log(err);
  }
  console.log(`deleted ${deleted} taggings`);
  console.log(`-------------------`)
  return deleted;
}

// remove all users that are not admins or that are not owners or editors
// of existing workspaces
// to do - set accountType for all users (and remove isAdmin field).
async function removeIrrelevantUsers() {
  console.log(`Starting removeIrrelevantUsers`)
  let deleted;
  let model = models.User;
  try {
    let regularUsers = await model.find({isAdmin: {$ne: true}}).exec();
    let admins = await model.find({isAdmin: true}).exec();
    let relevantUserIds = [];
    console.log(`there are ${regularUsers.length} regular users`);
    console.log(`there are ${admins.length} admins`);

    // deleted = await models.Workspace.deleteMany({_id: {$nin: ids}});
    let workspaces = await models.Workspace.find({}).exec();
    let wsUsers = workspaces.map(w => w.owner);

    console.log('matching workspaces', workspaces.length);
    console.log('uniqueUsers', wsUsers.length);
    for (let ws of workspaces) {
      ws.editors.forEach((ed) => {
        // indexOf does not seem to be working here, all are added.
        let ix = wsUsers.indexOf(ed);
        if (ix < 0) {
          wsUsers.push(ed);
        } else {
          console.log(`matched ${ed} to ${wsUsers[ix]}`);
        }
      })
    }

    // _.uniq does not seem to work here, none are removed.
    relevantUserIds = _.uniq(wsUsers);
    console.log('users with workspaces: ',wsUsers.length);
    console.log('unique users with workspaces: ',relevantUserIds.length);

    // This works!
    deleted = await model.deleteMany({_id: {$nin: wsUsers}, isAdmin: {$ne:true}});

    let newRegularUsers = await model.find({isAdmin: {$ne: true}}).exec();
    let newAdmins = await model.find({isAdmin: true}).exec();
    console.log(`there are ${newRegularUsers.length} regular users`);
    console.log(`there are ${newAdmins.length} admins`);

  }catch(err) {
    console.log(err);
  }
  console.log(`-------------------`)
  return deleted;
}


// check if workspaceIds in submissions
async function checkSubmissionWorkspaces() {
  console.log(`Starting checkSubmissionWorkspaces`)
  // let results;
  try {
    let workspaces = await models.Workspace.find({}).exec();
    let workspaceIds = workspaces.map(ws => ws._id);
    console.log(`workspaces.length: ${workspaceIds.length}`);

    let subs = await models.Submission.find({}).exec();
    console.log(`Initially, there are ${subs.length} submissions`);
    let deleted = 0;
    let deletedFromArray = 0;
    let subWs;
    let wsCount;
    // let subsToDel = [];
    subs.forEach((sub) => {
      subWs = sub.workspaces;
      wsCount = 0;
      subWs.forEach(() => {
        // // This does not work - get UnhandledProiseRejectionWarning for each read
        // // cannot use await on findById, it gives a syntax error on models
        // let wsFound = await models.Workspace.findById(ws._id).exec();
        // if (wsFound === null || wsFound === undefined) {
        //   // await model.deleteOne({_id: ws._id});
        //   deletedFromArray++;
        // }
        wsCount++;
      });
      if (wsCount === 0) {
        models.Submission.remove({ _id: sub._id }).exec();
        // subsToDel.push(sub._id)
        deleted++;
      }
    });
    // console.log(`submissions deleted: ${subsToDel}`);
    console.log(`submissions deleted count: ${deleted}`);
    console.log(`submission workspace array items deleted: ${deletedFromArray}`);
  }catch(err) {
    console.log(err);
  }
  console.log(`-------------------`)
  // return results;
}


// removes all invalid/missing workspaceIds from submissions
async function cleanSubmissionWorkspaces() {
  console.log(`Starting cleanSubmissionWorkspaces`)
  try {

    let workspaces = await models.Workspace.find({}).exec();
    let workspaceIds = workspaces.map(ws => ws._id);
    console.log(`workspaces.length: ${workspaceIds.length}`);
    let results = await models.Submission.updateMany({}, {$pull: {workspaces: {$nin: workspaceIds}}}).exec();
    console.log(`workspaces updated: ${results}`);

  }catch(err) {
    console.log(err);
  }
  console.log(`-------------------`)
  // return results;
}


// ensure collection has required fields
async function updateRequiredFields(collection) {
  console.log(`Starting updateRequiredFields for collection: ${collection}`)
  const coll = models[collection]
  // let allDocs = await coll.find({}).exec(); not used - duplicate of line 246
  try {

    const colDocs = await coll.find({}).exec();
    const colDocIds = colDocs.map(d => d._id);
    console.log(`There are ${colDocIds.length} colDocIds`)


    for (let id of colDocIds) {
      let doc = await coll.findById(id).exec();
      if ([ "Comment", "Folder", "Response", "Selection", "Tagging", "Workspace" ].indexOf(collection) >= 0) {
        // ensure createdBy, createDate, and lastModifiedDate is in all documents for these collections
        if (doc.createdBy === null || doc.createdBy === undefined) {
          doc.createdBy = "529518daba1cd3d8c4013344"; // Steve - (user doc #4)
          console.log(`createdBy updated to Steve for ${doc._id}`)
        }
        if (doc.createDate === null || doc.createDate === undefined) {
          doc.createDate = new Date();
        }
        if (doc.lastModifiedDate === null || doc.lastModifiedDate === undefined) {
          doc.lastModifiedDate = new Date();
        }
        await coll.update(
          { _id: id },
          { $set : {
            createdBy: doc.createdBy,
            createDate: doc.createDate,
            lastModifiedDate: doc.lastModifiedDate
          }}
        ).exec();
      } else if ([ "PDSubmission", "Submission" ].indexOf(collection) >= 0) {
        // ensure createDate, lastModifiedDate is in all documents for these collections
        if (doc.createDate === null || doc.createDate === undefined) {
          doc.createDate = new Date();
        }
        if (doc.lastModifiedDate === null || doc.lastModifiedDate === undefined) {
          doc.lastModifiedDate = new Date();
        }
        await coll.update(
          { _id: id },
          { $set : {
            createDate: doc.createDate,
            lastModifiedDate: doc.lastModifiedDate
          }}
        ).exec();
        await coll.update(
          { _id: id },
          { $set : {
            lastModifiedDate: new Date()
          }}
        ).exec();
      } else if ( "User" == collection ) {
        // ensure createDate, lastModifiedDate is in all documents for these collections
        if (doc.createDate === null || doc.createDate === undefined) {
          doc.createDate = new Date();
        }
        if (doc.lastModifiedDate === null || doc.lastModifiedDate === undefined) {
          doc.lastModifiedDate = new Date();
        }

        // Users if isAdmin AccountType A else T
        if (doc.isAdmin) {
          doc.accountType = 'A';
        } else {
          doc.accountType = 'T';
        }
        console.log(`username: ${doc.username} - isAdmin: ${doc.isAdmin} - accountType: ${doc.accountType}`)

        await coll.update(
          { _id: id },
          { $set : {
            createDate: doc.createDate,
            lastModifiedDate: doc.lastModifiedDate,
            accountType: doc.accountType
          }}
        ).exec();
        await coll.update(
          { _id: id },
          { $set : {
            lastModifiedDate: new Date()
          }}
        ).exec();
      }
    }

    // // does not work: gets TypeError: doc.save is not a function
    // await coll.find({  }, (err, doc) => {
    //   if (err) {
    //     console.log(`error finding doc - ${err}`);
    //   } else {
    //     doc.lastModifiedDate = new Date();
    //     doc.save((err2, raw) => {
    //       if (err) {
    //         console.log(`save callback error: ${err2}`)
    //       } else {
    //         console.log(`raw response: ${raw}`)
    //       }
    //     });
    //   }

    // }).exec();
  } catch(err) {
    console.log(err);
  }
  console.log(`-------------------`)
}


async function update() {
  mongoose.connect('mongodb://localhost:27017/encompass');
  // attempt to remove warning open() (which is deprecated) major failure needs revamp
  // https://mongoosejs.com/docs/4.x/docs/connections.html#use-mongo-client
  // var promise = mongoose.connect('mongodb://localhost:27017/encompass_prod', {
  //   useMongoClient: true,
  // });

  // remove trashed documents
  await removeTrashedDocuments();

  // remove selections, comments, responses, folders and taggings with no workspace
  const workspaces = await models.Workspace.find({}).exec();
  const workspaceIds = workspaces.map(ws => ws._id);
  console.log(`There are ${workspaceIds.length} workspaces`)
  for (let collection of ['Selection', 'Comment', 'Response', 'Folder', 'Tagging']) {
    await removeOrphanedFromWs(collection, workspaceIds);
  }

  // remove taggings without a matching folder and selection
  await removeOrphanedTaggings();

  // remove users who do not already have a workspace
  await removeIrrelevantUsers();

  // clean invalid workspaces from submissions, and delete any submissions with no workspaces.
  await checkSubmissionWorkspaces();
  await cleanSubmissionWorkspaces();
  await checkSubmissionWorkspaces();

  // update required fields for all collections
  for (let collection of allCollections) {
    await updateRequiredFields(collection);
  }

  mongoose.connection.close();
}

update();
