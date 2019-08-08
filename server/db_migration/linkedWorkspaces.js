const mongoose = require('mongoose');
const _ = require('underscore');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/encompass_seed');

const { isValidMongoId } = require('../utils/mongoose');

// Answer - convert workspaceToUpdate (objectId) to workspacesToUpdate (array)
// Assignment - convert linkedWorkspace (objectId) to linkedWorkspaces (array)

async function updateAnswers() {
  try {
    let answers = await models.Answer.find({});

    let updatedAnswers = answers.map((ans) => {
      let { workspaceToUpdate } = ans;

      let docUpdate = {$unset: {'workspaceToUpdate': ''} };
      if (isValidMongoId(workspaceToUpdate)) {
        docUpdate.$set = { workspacesToUpdate: [workspaceToUpdate]};
      } else {
        docUpdate.$set = { workspacesToUpdate: []};
      }
      return models.Answer.findByIdAndUpdate(ans._id, docUpdate, {strict: false});
    });
    return Promise.all(updatedAnswers);
  }catch(err) {
    console.log('error updating answers', err);
    throw(err);
  }
}

async function updateAssignments() {
  try {
    let assignments = await models.Assignment.find({});

    let updatedAssignments = assignments.map((assn) => {
      let { linkedWorkspace } = assn;

      let docUpdate = {$unset: {'linkedWorkspace': ''} };
      if (isValidMongoId(linkedWorkspace)) {
        docUpdate.$set = { linkedWorkspaces: [linkedWorkspace]};
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
async function migrate() {
  try {
    await updateAnswers();
    console.log('done updating answers');
    await updateAssignments();
    console.log('done updating assignments');
    mongoose.connection.close();
  }catch(err) {
    console.log('migrate err: ', err);
    mongoose.connection.close();
    throw(err);
  }
}

migrate();