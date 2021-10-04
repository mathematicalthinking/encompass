const mongoose = require('mongoose');
const _ = require('underscore');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

 mongoose.connect('mongodb://localhost:27017/encompass');

 async function convertEditors() {
   try {
    let workspaces = await models.Workspace.find({ permissions: { $ne: [] } }).exec();
    console.log(`There are ${workspaces.length} workspaces with non empty permissions`);

    let editorCollabCount = 0;
    let missingCustomCount = 0;
    let folderValueis4Count = 0;

    let results = Promise.all(workspaces.map((ws) => {
      let permissionObjects = ws.permissions || [];

      permissionObjects.forEach((obj) => {
        let globalSetting = obj.global;
        if (_.isUndefined(globalSetting) || _.isNull(globalSetting)) {
          missingCustomCount++;
          // set global to 'custom'
          obj.global = 'custom';
        }
        if (globalSetting === 'editor') {
          obj.folders = 3;
          obj.comments = 4;
          obj.selections = 4;
          obj.feedback = 'none';
          obj.submissions.all = true;

          editorCollabCount++;
        } else if (obj.folders === 4) {
          folderValueis4Count++;
          obj.folders = 3;
        }
      });
      return ws.save();
    }));

    console.log(`There are ${editorCollabCount} editor collabs to update`);
    console.log(`There are ${missingCustomCount} collabs missing global value`);
    console.log(`There are ${folderValueis4Count} collabs with folder setting 4 to update`);

    return results;


   }catch(err) {
     console.error(`Error convertEditors: ${err}`);
   }

 }

 return convertEditors()
   .then((results) => {
     console.log('done!');
     mongoose.connection.close();
   });