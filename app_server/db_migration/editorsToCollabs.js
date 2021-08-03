const mongoose = require('mongoose');
const _ = require('underscore');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

 mongoose.connect('mongodb://localhost:27017/encompass');

 /*
 findAll workspaces (non-trashed? or all?) and populate editors
 map editors array to permission objects and add to workspace's permissions
 add workspace to user's collabWorkspaces array

 permissions: [ {
    user: { type: ObjectId, ref: 'User'},
    global: {type: String, enum: ['viewOnly', 'editor', 'custom'] },
    submissions: {
      all: { type: Boolean },
      submissionIds: [ {type: ObjectId, ref: 'Submission'} ],
      userOnly: { type: Boolean }
    },
    folders: { type: Number, enum: [0, 1, 2, 3, 4] },
    comments: { type: Number, enum: [0, 1, 2, 3, 4] },
    selections: { type: Number, enum: [0, 1, 2, 3, 4] },
    feedback: { type: String, enum: ['none', 'authReq', 'preAuth'] }

  }],
 */

 async function convertEditorsToCollabs() {
  const workspaces = await models.Workspace.find({}).populate('editors').exec();
  let editorCount = 0;
  const workspacesWithCollabs = await Promise.all(workspaces.map((ws) => {
    const editors = ws.editors;
    const editorsWithIds = _.filter(editors, editor => editor._id);

    let permissionObjects = [];
    if (_.isArray(editors)) {
      permissionObjects = editorsWithIds.map((editor) => {
        editorCount++;
        return {
          user: editor._id,
          global: 'editor',
          submissions: {
            all: true
          },
          folders: 4,
          comments: 4,
          selections: 4,
          feedback: 'preAuth'
        };
      });
    }
    ws.permissions = permissionObjects;
    ws.editors = editorsWithIds.map(editor => editor._id);
    return ws.save();
  }));
  return editorCount;

 }

 function migrate() {
   return convertEditorsToCollabs().then((res) => {
    console.log(`migrated ${res} editors`);
    mongoose.connection.close();
    console.log('done!');
   })
   .catch((err) => {
     console.log('err', err);
   });
 }

 migrate();