const { ObjectId, ISODate } = require('./utils');

module.exports = [
/* 1 */
{
  "_id" : ObjectId("5bec36958c73047613e2f34f"),
  "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "teacher" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "assignment" : ObjectId("5b91743a3da5efca74705773"),
  "createdWorkspace" : ObjectId("5bec36958c73047613e2f34e"),
  "permissionObjects" : [],
  "answers" : [],
  "lastModifiedDate" : ISODate("2018-11-14T14:30:46.558Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2018-11-14T14:30:46.558Z")
},

/* 2 */
{
  "_id" : ObjectId("5c6ebc4a9852e5710311d642"),
  "createdBy" : ObjectId("5c6eb45d9852e5710311d633"),
  "createdWorkspace" : ObjectId("5c6ebc4a9852e5710311d641"),
  "permissionObjects" : [],
  "answers" : [
      ObjectId("5c6eb7f89852e5710311d639"),
      ObjectId("5c6eb8319852e5710311d63c"),
      ObjectId("5c6eb85d9852e5710311d63d")
  ],
  "lastModifiedDate" : ISODate("2019-02-21T13:00:49.201Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2019-02-21T13:00:49.201Z")
},

/* 3 */
{
  "_id" : ObjectId("5bb814d19885323f6d894979"),
  "startDate" : ISODate("2018-10-05T04:00:00.000Z"),
  "endDate" : ISODate("2018-10-06T03:59:59.000Z"),
  "folderSetName" : "Simple Folder Set",
  "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "teacher" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "assignment" : ObjectId("5b91743a3da5efca74705773"),
  "createdWorkspace" : ObjectId("5bb814d19885323f6d894974"),
  "permissionObjects" : [],
  "answers" : [],
  "lastModifiedDate" : ISODate("2018-10-06T01:44:45.183Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2018-10-06T01:44:45.183Z")
},
];