var Seeder = require('mongoose-data-seed').Seeder;
var CopyWorkspaceRequest = require('../server/datasource/schemas').CopyWorkspaceRequest;

var data = [
  {
    "_id" : "5c6ec5eba89be9751158ce05",
    "name" : "Copy of MTG Congruent Rectangles",
    "mode" : "private",
    "copyWorkspaceError" : null,
    "createdBy" : "5c6eb45d9852e5710311d633",
    "lastModifiedBy" : null,
    "owner" : "5c6eb49c9852e5710311d634",
    "originalWsId" : "5c6ebc4a9852e5710311d641",
    "createdWorkspace" : "5c6ec5eba89be9751158ce06",
    "createdFolderSet" : null,
    "permissionOptions" : {
        "permissionObjects" : []
    },
    "responseOptions" : {
        "none" : true,
        "responseIds" : []
    },
    "commentOptions" : {
        "none" : true,
        "commentIds" : []
    },
    "selectionOptions" : {
        "none" : true,
        "selectionIds" : []
    },
    "folderOptions" : {
        "none" : true,
        "folderSetOptions" : {
            "doCreateFolderSet" : false
        }
    },
    "submissionOptions" : {
        "all" : true,
        "submissionIds" : []
    },
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : null
}
];

var CopyWorkspaceRequestsSeeder = Seeder.extend({
  shouldRun: function () {
    return CopyWorkspaceRequest.count().exec().then(count => count === 0);
  },
  run: function () {
    return CopyWorkspaceRequest.create(data);
  }
});

module.exports = CopyWorkspaceRequestsSeeder;