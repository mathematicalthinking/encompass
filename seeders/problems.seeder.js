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
    "createdBy": "5b245841ac75842be3189526",
    "puzzleId": 973,
    "categories": [],
    "isPublic": false,
    "privacySetting": 'M',
    "isTrashed": false
  },
  {
    "_id" : "5b91463c3add43b868ae9808",
    "title" : "DrexelU Org Problem",
    "puzzleId" : null,
    "text" : "This problem is only for members of Drexel University",
    "imageUrl" : null,
    "sourceUrl" : null,
    "imageData" : null,
    "imageId" : null,
    "additionalInfo" : null,
    "privacySetting" : "O",
    "createdBy" : "5b245841ac75842be3189526",
    "lastModifiedBy" : null,
    "origin" : null,
    "modifiedBy" : null,
    "organization" : "5b4a64a028e4b75919c28512",
    "categories" : [],
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-09-06T15:22:36.371Z"
},
{
  "_id" : "5b9173e23da5efca74705772",
  "title" : "Summer's Org Problem",
  "puzzleId" : null,
  "text" : "This is Summer's problem",
  "imageUrl" : null,
  "sourceUrl" : null,
  "imageData" : null,
  "imageId" : null,
  "additionalInfo" : "",
  "privacySetting" : "O",
  "createdBy" : "5b9149552ecaf7c30dd4748e",
  "lastModifiedBy" : null,
  "origin" : null,
  "modifiedBy" : null,
  "organization" : "5b4e4d5f808c7eebc9f9e82c",
  "categories" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-06T18:37:22.437Z"
},
{
  "_id" : "5ba7c3cb1359dc2f6699f2b3",
  "title" : "Tim's Public Problem",
  "puzzleId" : null,
  "text" : "This problem is for everyone.",
  "imageUrl" : null,
  "sourceUrl" : null,
  "additionalInfo" : null,
  "privacySetting" : "E",
  "error" : null,
  "createdBy" : "5ba7bedd2b7ba22c38a554fc",
  "lastModifiedBy" : null,
  "image" : null,
  "origin" : null,
  "modifiedBy" : null,
  "organization" : "5b4e4b48808c7eebc9f9e827",
  "categories" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-09-23T16:48:11.924Z"
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
