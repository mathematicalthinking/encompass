var Seeder = require('mongoose-data-seed').Seeder;
var Problem = require('../server/datasource/schemas').Problem;

var data = [
  {
    "_id": "5b4e25c638a46a41edf1709a",
    "title": "Rick's Public",
    "puzzleId": null,
    "text": "What is it?",
    "imageUrl": null,
    "sourceUrl": null,
    "additionalInfo": "Be careful!",
    "createdBy": "5b245760ac75842be3189525",
    "categories": [],
    "isPublic": true,
    "privacySetting" : 'E',
    "isTrashed": false,
  }, {
    "_id": "5b4e2e56be1e18425515308c",
    "title": "Rick's Private",
    "puzzleId": null,
    "text": "What is it?",
    "imageUrl": null,
    "sourceUrl": null,
    "additionalInfo": "Be careful!",
    "createdBy": "5b245760ac75842be3189525",
    "categories": [],
    "isPublic": false,
    "privacySetting": 'M',
    "isTrashed": false,
  }, {
    "_id": "5b4e2e6cbe1e18425515308d",
    "title": "Morty's Public",
    "puzzleId": null,
    "text": "What is it?",
    "imageUrl": null,
    "sourceUrl": null,
    "additionalInfo": "Be careful!",
    "createdBy": "5b245841ac75842be3189526",
    "categories": [],
    "isPublic": true,
    "privacySetting": 'E',
    "isTrashed": false,
  }, {
    "_id": "5b1e7a0ba5d2157ef4c91028",
    "title": "Mr. W. Goes Across Australia",
    "puzzleId": 973,
    "categories": [],
    "isPublic": false,
    "privacySetting": 'M',
    "isTrashed": false
  }
];

var ProblemsSeeder = Seeder.extend({
  shouldRun: function () {
    return Problem.count().exec().then(count => count === 0);
  },
  run: function () {
    return Problem.create(data);
  }
});

module.exports = ProblemsSeeder;
