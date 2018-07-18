var Seeder = require('mongoose-data-seed').Seeder;
var Answer = require('../server/datasource/schemas').Answer;

var data = [
  {
    "_id": "5b1e7abfa5d2157ef4c910b8",
    "studentName": "student1",
    "answer": "12.9%",
    "studentId": "5b368b77ba3e40a94fc5458d",
    "explanation": "\u003cpre\u003eThat's my answer and I'm \u003ci\u003esticking\u003c/i\u003e \u003cu\u003eto\u003c/u\u003e \u003cb\u003eit\u003c/b\u003e!\u003c/pre\u003e",
    "problemId": "5b1e7a0ba5d2157ef4c91028",
    "sectionId": "5b1e7b2aa5d2157ef4c91108",
    "isTrashed": false,
    "isSubmitted": true
  },
  {
    "_id": "5b27fa71d522ff21c58d40b8",
    "studentName": "David T.",
    "answer": "12.9%",
    "explanation": "\u003cpre\u003eThat's my answer and I'm \u003ci\u003esticking\u003c/i\u003e \u003cu\u003eto\u003c/u\u003e \u003cb\u003eit\u003c/b\u003e!\u003c/pre\u003e",
    "problemId": "5b1e7a0ba5d2157ef4c91028",
    "sectionId": "5b1e7b2aa5d2157ef4c91108",
    "isTrashed": false,
    "isSubmitted": false
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

