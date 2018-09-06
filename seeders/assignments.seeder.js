var Seeder = require('mongoose-data-seed').Seeder;
var Assignment = require('../server/datasource/schemas').Assignment;

var data = [
  {
    "_id" : "5b9146a83add43b868ae9809",
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