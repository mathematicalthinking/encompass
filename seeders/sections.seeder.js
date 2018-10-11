var Seeder = require('mongoose-data-seed').Seeder;
var Section = require('../server/datasource/schemas').Section;

var data = [{
  "_id": "5b1e7b2aa5d2157ef4c91108",
  "sectionId": 26916,
  "name": "Drexel University",
  "problems": ["5b1e7a0ba5d2157ef4c91028"],
  "students": ["5b368afdca1375a94fabde39"],
  "teachers": ["5b1e7bf9a5d2157ef4c911a6"],
  "assignments": [],
  "organization": "5b4a64a028e4b75919c28512",
  "isTrashed": false,
  "createdBy": "5b245760ac75842be3189525",
},
{
  "_id" : "5b913e723add43b868ae9804",
  "name" : "Morty's Math 101",
  "sectionPassword" : null,
  "createdBy" : "5b245841ac75842be3189526",
  "lastModifiedBy" : null,
  "organization" : "5b4a64a028e4b75919c28512",
  "assignments" : [],
  "students" : [
      "5b913ea33add43b868ae9805",
      "5b913eaf3add43b868ae9806",
      "5b913ebe3add43b868ae9807"
  ],
  "teachers" : [
      "5b245841ac75842be3189526"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-06T14:49:22.982Z"
},
{
  "_id" : "5b9149a32ecaf7c30dd4748f",
  "name" : "Summer's Algebra 2 1st Period",
  "sectionPassword" : null,
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "organization" : "5b4e4d5f808c7eebc9f9e82c",
  "assignments" : ["5b91743a3da5efca74705773"],
  "students" : [
      "5b9149c22ecaf7c30dd47490",
      "5b9149f52ecaf7c30dd47491",
      "5b914a102ecaf7c30dd47492",
      "5b99146e25b620610ceead75"
  ],
  "teachers" : [
      "5b9149552ecaf7c30dd4748e",
      "5b914a802ecaf7c30dd47493"
  ],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-06T15:37:07.827Z"
},
{
  "_id" : "5bbdfaaaecd6e597fd8d3d42",
  "isTrashed" : true,
  "createdBy": "5b9149552ecaf7c30dd4748e"
}
];


var SectionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Section.count().exec().then(count => count === 0);
  },
  run: function () {
    return Section.create(data);
  }
});

module.exports = SectionsSeeder;
