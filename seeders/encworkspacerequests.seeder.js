var Seeder = require('mongoose-data-seed').Seeder;
var EncWorkspaceRequest = require('../server/datasource/schemas').EncWorkspaceRequest;

var data = [
  {
    "_id" : "5bb814d19885323f6d894979",
    "startDate" : "2018-10-05T04:00:00.000Z",
    "endDate" : "2018-10-06T03:59:59.000Z",
    "folderSetName" : "Simple Folder Set",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "teacher" : "5b4e4b48808c7eebc9f9e827",
    "assignment" : "5b91743a3da5efca74705773",
    "createdWorkspace" : "5bb814d19885323f6d894974",
    "lastModifiedDate" : "2018-10-06T01:44:45.183Z",
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:44:45.183Z"
}
];

var EncWorkspaceRequestsSeeder = Seeder.extend({
  shouldRun: function () {
    return EncWorkspaceRequest.count().exec().then(count => count === 0);
  },
  run: function () {
    return EncWorkspaceRequest.create(data);
  }
});

module.exports = EncWorkspaceRequestsSeeder;