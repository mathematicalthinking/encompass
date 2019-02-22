var Seeder = require('mongoose-data-seed').Seeder;
var Organization = require('../server/datasource/schemas').Organization;

var data = [
  {
    '_id': '5b4a64a028e4b75919c28512',
    'name': 'Drexel University',
    "createdBy": "5b245760ac75842be3189525",
    "recommendedProblems": ["53a4479432f2863240000339", "53a447b432f286324000033d", "5bac07fdea4c0a230b2c7cda"],
  }, {
    '_id': '5b4e4b48808c7eebc9f9e828',
    'name': 'Temple University',
    "createdBy": "5b245760ac75842be3189525",
    "recommendedProblems": ["5b4e2e6cbe1e18425515308f", "53a4479432f2863240000339"],
  }, {
    '_id': '5b4e4d5f808c7eebc9f9e82c',
    'name': 'Mathematical Thinking',
    "createdBy": "5b245760ac75842be3189525",
    "recommendedProblems": ["5b4e2e6cbe1e18425515304e", "5ba7c3cb1359dc2f6699f2b3"],
  },
  {
    "_id" : "5bbe00a2ecd6e597fd8e397b",
    "isTrashed" : true,
    "name" : "trashed org",
    "createdBy": "5b245760ac75842be3189525"
},
{
  "_id" : "5c6df20a9466896b1c5d84af",
  "name" : "Montgomery Elementary",
  "createdBy" : "5b245760ac75842be3189525",
  "lastModifiedBy" : null,
  "recommendedProblems" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2019-02-21T00:34:18.678Z"
},
{
  "_id" : "5c6f4032b1ccdf96abab26fc",
  "name" : "Mentors University",
  "createdBy" : "5b245760ac75842be3189525",
  "lastModifiedBy" : null,
  "recommendedProblems" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2019-02-22T00:20:02.678Z"
}

];

var OrganizationsSeeder = Seeder.extend({
  shouldRun: function () {
    return Organization.count().exec().then(count => count === 0);
  },
  run: function () {
    return Organization.create(data);
  }
});

module.exports = OrganizationsSeeder;
