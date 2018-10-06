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
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "section" : "5b9149a32ecaf7c30dd4748f",
  "problem" : "5b9173e23da5efca74705772",
  "answers" : ["5bb813fc9885323f6d894972"],
  "students" : [
      "5b9149c22ecaf7c30dd47490",
      "5b9149f52ecaf7c30dd47491",
      "5b914a102ecaf7c30dd47492",
      "5b99146e25b620610ceead75"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-06T18:38:50.073Z"
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