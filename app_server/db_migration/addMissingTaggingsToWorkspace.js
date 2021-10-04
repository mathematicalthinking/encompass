const mongoose = require('mongoose');
const _ = require('underscore');

const models = require('../datasource/schemas');
const { areObjectIdsEqual, isValidMongoId } = require('../utils/mongoose');
const { isNonEmptyArray } = require('../utils/objects');
mongoose.Promise = global.Promise;

 mongoose.connect('mongodb://localhost:27017/encompass');

let folderTagCount = 0;

async function findMissingTaggings() {
try {
  let workspaces = await models.Workspace.find({
    isTrashed: false,
    selections: { $exists: true, $ne: [] },
    folders: {$exists: true, $ne: []}
  }).populate({path: 'folders', populate: {path: 'taggings'}});

  let saved = workspaces.map(async (ws) => {
    let folders = ws.folders;
    let existingWsTaggingIds = ws.taggings || [];
    let newTaggingIds = [];
    let missingWorkspaceTaggingIds = [];
    let missingFolderTaggingIds = [];

    folders.forEach((folder) => {
      let taggings = folder.taggings || [];

      taggings.forEach((t) => {
        let isForWs = areObjectIdsEqual(t.workspace, ws._id);
        if (!isForWs) {
          missingWorkspaceTaggingIds.push(t._id);
        }
        let isForFolder = areObjectIdsEqual(t.folder, folder._id);
        if (!isForFolder) {
          console.log('tagging not for folder', t);
          missingFolderTaggingIds.push(t._id);
        }

        let isInExistingWsTaggings = _.find(existingWsTaggingIds, (tagId) => {
          return areObjectIdsEqual(tagId, t._id);
        });

        if (isForFolder && !t.isTrashed && !isInExistingWsTaggings) {
          newTaggingIds.push(t._id);
          folderTagCount++;
        }
      });
    });
    if (isNonEmptyArray(missingWorkspaceTaggingIds)) {
      await models.Tagging.updateMany({ _id: {$in: missingWorkspaceTaggingIds} }, {$set: {workspace: ws._id}}).exec();
    }

    if (isNonEmptyArray(newTaggingIds)) {
      return models.Workspace.update({_id: ws._id}, {$addToSet: {taggings: {$each: newTaggingIds}} }).exec();
    }
  });

  return Promise.all(saved);

}catch(err) {
  console.error(`Error findMissingTaggings: ${err}`);
}
}
function removeTrashedTaggingsFromWs() {
  let trashedCount = 0;
  return models.Workspace.find({isTrashed: false, taggings: {$exists: true, $ne: []}}).populate('taggings').lean().exec()
    .then((workspaces) => {
      let saved = workspaces.map((ws) => {
        let taggings = ws.taggings;
        let trashedTaggings = taggings.filter(t => t.isTrashed);

        if (isNonEmptyArray(trashedTaggings)) {
          console.log('trashedTaggings in workspace!', trashedTaggings);
          trashedCount += trashedTaggings.length;
        }
      });
      return Promise.all(saved);
    })
    .then((results) => {
      console.log('done, removed ', trashedCount, ' trashed taggings');
      mongoose.connection.close();
    });
}
function migrate() {
  return findMissingTaggings()
    .then((res) => {
      console.log(`done!, added  ${folderTagCount} taggings to workspaces`);
      mongoose.connection.close();
    });
}

// migrate();
//removeTrashedTaggingsFromWs();