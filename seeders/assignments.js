const { ObjectId, ISODate } = require('./utils');

module.exports = [
/* 1 */
{
  "_id" : ObjectId("5b9146a83add43b868ae9809"),
  "name" : "DrexelU Org Problem / Sep 6th 2018",
  "assignedDate" : ISODate("2018-09-06T04:00:00.000Z"),
  "dueDate" : ISODate("2018-09-30T04:00:00.000Z"),
  "createdBy" : ObjectId("5b245841ac75842be3189526"),
  "lastModifiedBy" : null,
  "section" : ObjectId("5b913e723add43b868ae9804"),
  "problem" : ObjectId("5b91463c3add43b868ae9808"),
  "assignmentType" : "problem",
  "answers" : [],
  "students" : [
      ObjectId("5b913ea33add43b868ae9805"),
      ObjectId("5b913eaf3add43b868ae9806"),
      ObjectId("5b913ebe3add43b868ae9807")
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2018-09-06T15:24:24.236Z")
},

/* 2 */
{
  "_id" : ObjectId("5c6eb5199852e5710311d638"),
  "name" : "MTG Period 1 SCR",
  "assignedDate" : ISODate("2019-02-21T05:00:00.000Z"),
  "dueDate" : ISODate("2024-02-02T04:59:59.000Z"),
  "assignmentType" : null,
  "createdBy" : ObjectId("5c6eb45d9852e5710311d633"),
  "lastModifiedBy" : null,
  "section" : ObjectId("5c6eb4d49852e5710311d637"),
  "problem" : ObjectId("5bac07fcea4c0a230b2c7ab0"),
  "taskWorkspace" : null,
  "linkedWorkspaces" : [],
  "answers" : [
      ObjectId("5c6eb7f89852e5710311d639"),
      ObjectId("5c6eb8319852e5710311d63c"),
      ObjectId("5c6eb85d9852e5710311d63d")
  ],
  "students" : [
      ObjectId("5c6eb49c9852e5710311d634"),
      ObjectId("5c6eb4ac9852e5710311d635"),
      ObjectId("5c6eb4c19852e5710311d636")
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2019-02-21T14:26:33.628Z")
},

/* 3 */
{
  "_id" : ObjectId("5bbdfed7ecd6e597fd8da683"),
  "problem" : ObjectId("5b9173e23da5efca74705772"),
  "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "answers" : [],
  "students" : [],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.863Z"),
  "isTrashed" : true,
  "createDate" : ISODate("2019-07-01T17:23:27.863Z")
},

/* 4 */
{
  "_id" : ObjectId("5b91743a3da5efca74705773"),
  "name" : "Summer's Org Problem / Sep 6th 2018",
  "assignedDate" : ISODate("2018-09-06T04:00:00.000Z"),
  "dueDate" : ISODate("2018-11-30T05:00:00.000Z"),
  "createdBy" : ObjectId("5b4e4b48808c7eebc9f9e827"),
  "lastModifiedBy" : null,
  "section" : ObjectId("5b9149a32ecaf7c30dd4748f"),
  "problem" : ObjectId("5b9173e23da5efca74705772"),
  "assignmentType" : "problem",
  "linkedWorkspaces" : [ObjectId("5bec36958c73047613e2f34e"), ObjectId("5d5d60ef4f217a59dfbbdeeb")],
  "answers" : [
      ObjectId("5bb813fc9885323f6d894972"),
      ObjectId("5bec35898c73047613e2f34b")
  ],
  "students" : [
      ObjectId("5b9149c22ecaf7c30dd47490"),
      ObjectId("5b9149f52ecaf7c30dd47491"),
      ObjectId("5b914a102ecaf7c30dd47492"),
      ObjectId("5b99146e25b620610ceead75")
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2018-09-06T18:38:50.073Z")
},
];
