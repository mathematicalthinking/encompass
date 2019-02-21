var Seeder = require('mongoose-data-seed').Seeder;
var Assignment = require('../server/datasource/schemas').Assignment;

var data = [
  {
    "_id" : "5b9146a83add43b868ae9809",
    "name": "DrexelU Org Problem / Sep 6th 2018",
    "assignedDate" : "2018-09-06T04:00:00.000Z",
    "dueDate" : "2018-09-30T04:00:00.000Z",
    "createdBy" : "5b245841ac75842be3189526",
    "lastModifiedBy" : null,
    "section" : "5b913e723add43b868ae9804",
    "problem" : "5b91463c3add43b868ae9808",
    "assignmentType": "problem",
    "answers" : [],
    "students" : [
        "5b913ea33add43b868ae9805",
        "5b913eaf3add43b868ae9806",
        "5b913ebe3add43b868ae9807"
    ],

    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-09-06T15:24:24.236Z"
},
{
  "_id" : "5b91743a3da5efca74705773",
  "name": "Summer's Org Problem / Sep 6th 2018",
  "assignedDate" : "2018-09-06T04:00:00.000Z",
  "dueDate" : "2018-11-30T05:00:00.000Z",
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "section" : "5b9149a32ecaf7c30dd4748f",
  "problem" : "5b9173e23da5efca74705772",
  "assignmentType": "problem",
  "answers" : ["5bb813fc9885323f6d894972", "5bec35898c73047613e2f34b"],
  "students" : [
      "5b9149c22ecaf7c30dd47490",
      "5b9149f52ecaf7c30dd47491",
      "5b914a102ecaf7c30dd47492",
      "5b99146e25b620610ceead75"
  ],
  "linkedWorkspace": "5bec36958c73047613e2f34e",
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-06T18:38:50.073Z"
},
{
  "_id" : "5bbdfed7ecd6e597fd8da683",
  "isTrashed" : true,
  "problem": "5b9173e23da5efca74705772",
  "createdBy": "5b4e4b48808c7eebc9f9e827"
},
{
  "_id" : "5c6eb5199852e5710311d638",
  "name" : "MTG Period 1 SCR",
  "assignedDate" : "2019-02-21T05:00:00.000Z",
  "dueDate" : "2024-02-02T04:59:59.000Z",
  "assignmentType" : null,
  "createdBy" : "5c6eb45d9852e5710311d633",
  "lastModifiedBy" : null,
  "section" : "5c6eb4d49852e5710311d637",
  "problem" : "5bac07fcea4c0a230b2c7ab0",
  "taskWorkspace" : null,
  "linkedWorkspace" : null,
  "answers" : ["5c6eb7f89852e5710311d639",
  "5c6eb8319852e5710311d63c",
  "5c6eb85d9852e5710311d63d"],
  "students" : [
      "5c6eb49c9852e5710311d634",
      "5c6eb4ac9852e5710311d635",
      "5c6eb4c19852e5710311d636"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2019-02-21T14:26:33.628Z"
}
];

var AssignmentsSeeder = Seeder.extend({
  shouldRun: function () {
    return Assignment.count().exec().then(count => count === 0);
  },
  run: function () {
    return Assignment.create(data);
  }
});

module.exports = AssignmentsSeeder;