const mongoose = require('mongoose');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/encompass');

const { isValidMongoId } = require('../utils/mongoose');

// Answer - convert workspaceToUpdate (objectId) to workspacesToUpdate (array)
// Assignment - convert linkedWorkspace (objectId) to linkedWorkspaces (array)

function addWorkspacesToUpdate() {
  return models.Answer.updateMany({}, {$set: {workspacesToUpdate: []}});
}
async function updateAnswers(){
  let updatedCount = 0;

  try {
    let answers = await models.Answer.find({workspaceToUpdate: {$exists: true}}, {workspaceToUpdate: 1}).lean();
    let updatedAnswers = answers.map(async (ans) => {
      let { workspaceToUpdate } = ans;

      let docUpdate = {$unset: {'workspaceToUpdate': ''} };
      if (isValidMongoId(workspaceToUpdate)) {
        docUpdate.$set = { workspacesToUpdate: [workspaceToUpdate]};
      } else {
        docUpdate.$set = { workspacesToUpdate: []};
      }
      await models.Answer.findByIdAndUpdate(ans._id, docUpdate, {strict: false});
      updatedCount++;
      if (updatedCount % 10 === 0) {
        console.log('Answers updated: ', updatedCount);
      }
      return true;
    });
    return Promise.all(updatedAnswers);
  }catch(err) {
    console.log('error updating answers', err);
    throw(err);
  }
}

async function updateAssignments() {
  try {
    let assignments = await models.Assignment.find({}, {linkedWorkspace: 1}).lean();

    let updatedAssignments = assignments.map((assn) => {
      let { linkedWorkspace, linkedWorkspaces } = assn;

      let docUpdate = {$unset: {'linkedWorkspace': ''} };

      if (isValidMongoId(linkedWorkspace)) {
        if (Array.isArray(linkedWorkspaces)) {
          docUpdate.$set = { linkedWorkspaces: {$addToSet: {linkedWorkspace}}};
        } else {
          docUpdate.$set = { linkedWorkspaces: [linkedWorkspace]};
        }
      } else {
        docUpdate.$set = { linkedWorkspaces: []};
      }
      return models.Assignment.findByIdAndUpdate(assn._id, docUpdate, {strict: false});
    });

    return Promise.all(updatedAssignments);
  }catch(err) {
    console.log('error updating assignments', err);
    throw(err);
  }
}

async function addMissingLinkedWorkspaces() {
  try {
    // find workspaces with a linkedAssignment
    // check if that assignment has the workspace in
    // its linkedWorkspaces array. if not add it
    let workspaces = await models.Workspace.find({linkedAssignment: {$type: 'objectId'}}).lean();

    console.log(`There are ${workspaces.length} workspaces linked to an assignment`);

    let updateResults = workspaces.map((ws) => {
      let assignmentId = ws.linkedAssignment;
      let filter = { _id: assignmentId, linkedWorkspaces: {$ne: ws._id}};
      let update = { $addToSet: {linkedWorkspaces: ws._id}};

      return models.Assignment.update(filter, update);
    });
    await Promise.all(updateResults);
  }catch(err) {
    console.log({addMissingLinkedWorkspacesErr: err});
  }
}
async function migrate() {
  try {
    await addWorkspacesToUpdate();
    console.log('done adding default workspacesToUpdate to all answers');
    await updateAnswers();
    console.log('done updating answers');
    await updateAssignments();
    console.log('done updating assignments');

    await addMissingLinkedWorkspaces();
    console.log('done!');
    mongoose.connection.close();
  }catch(err) {
    console.log('migrate err: ', err);
    mongoose.connection.close();
    throw(err);
  }
}

 migrate();
