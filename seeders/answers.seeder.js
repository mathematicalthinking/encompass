/*
 * We are using mongoose-data-seed to seed our test database
 * The data below has been fitlered using the function found in server/db_migration/filter-mongo.js
 * To use mongoose-data-seed you must provide the schema to be used for the test data
 * Then when you run md-seed run it will populate the database with the provide data referencing the schema
 */

var Seeder = require('mongoose-data-seed').Seeder;
var Answer = require('../server/datasource/schemas').Answer;

var data = [
  {
    "_id": "5b1e7abfa5d2157ef4c910b8",
    "createdBy": '5b368afdca1375a94fabde39',
    "studentName": "student1",
    "answer": "12.9%",
    "studentId": "5b368b77ba3e40a94fc5458d",
    "explanation": "\u003cpre\u003eThat's my answer and I'm \u003ci\u003esticking\u003c/i\u003e \u003cu\u003eto\u003c/u\u003e \u003cb\u003eit\u003c/b\u003e!\u003c/pre\u003e",
    "problem": "5b1e7a0ba5d2157ef4c91028",
    "section": "5b1e7b2aa5d2157ef4c91108",
    "isTrashed": false,
    "isSubmitted": true
  },
  {
    "_id": "5b27fa71d522ff21c58d40b8",
    "createdBy": '5b3688218610e3bfecca403c',
    "studentName": "testUser",
    "answer": "12.9%",
    "explanation": "\u003cpre\u003eThat's my answer and I'm \u003ci\u003esticking\u003c/i\u003e \u003cu\u003eto\u003c/u\u003e \u003cb\u003eit\u003c/b\u003e!\u003c/pre\u003e",
    "problem": "5b1e7a0ba5d2157ef4c91028",
    "section": "5b1e7b2aa5d2157ef4c91108",
    "isTrashed": false,
    "isSubmitted": false
  },
  {
    "_id" : "5bb813fc9885323f6d894972",
    "answer" : "This is a brief summary of my thoughts.",
    "explanation" : "<p>This is my explanation.</p>",
    "createdBy" : "5b914a102ecaf7c30dd47492",
    "lastModifiedBy" : null,
    "problem" : "5b9173e23da5efca74705772",
    "explanationImage" : null,
    "section" : "5b9149a32ecaf7c30dd4748f",
    "priorAnswer" : null,
    "assignment" : "5b91743a3da5efca74705773",
    "additionalImage" : null,
    "isSubmitted" : true,
    "students" : [
        "5b914a102ecaf7c30dd47492"
    ],
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:46:36.979Z"
},
{
  "_id" : "5bbd0e20ecd6e597fd89a740",
  "isTrashed" : true,
  "problem": "5b9173e23da5efca74705772",
  "createdBy": "5b914a102ecaf7c30dd47492"
}

];

var AnswersSeeder = Seeder.extend({
  shouldRun: function () {
    return Answer.count().exec().then(count => count === 0);
  },
  run: function () {
    return Answer.create(data);
  }
});

module.exports = AnswersSeeder;

