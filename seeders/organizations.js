const { ObjectId, ISODate } = require('./utils');

module.exports = [
/* 1 */
{
  "_id" : ObjectId("5b4a64a028e4b75919c28512"),
  "name" : "Drexel University",
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "recommendedProblems" : [
      ObjectId("53a4479432f2863240000339"),
      ObjectId("53a447b432f286324000033d"),
      ObjectId("5bac07fdea4c0a230b2c7cda")
  ],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.862Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2019-07-01T17:23:27.862Z")
},

/* 2 */
{
  "_id" : ObjectId("5b4e4b48808c7eebc9f9e828"),
  "name" : "Temple University",
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "recommendedProblems" : [
      ObjectId("5b4e2e6cbe1e18425515308f"),
      ObjectId("53a4479432f2863240000339")
  ],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.862Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2019-07-01T17:23:27.862Z")
},

/* 3 */
{
  "_id" : ObjectId("5b4e4d5f808c7eebc9f9e82c"),
  "name" : "Mathematical Thinking",
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "recommendedProblems" : [
      ObjectId("5b4e2e6cbe1e18425515304e"),
      ObjectId("5ba7c3cb1359dc2f6699f2b3")
  ],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.862Z"),
  "isTrashed" : false,
  "createDate" : ISODate("2019-07-01T17:23:27.862Z")
},

/* 4 */
{
  "_id" : ObjectId("5c6f4032b1ccdf96abab26fc"),
  "name" : "Mentors University",
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "lastModifiedBy" : null,
  "recommendedProblems" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2019-02-22T00:20:02.678Z")
},

/* 5 */
{
  "_id" : ObjectId("5bbe00a2ecd6e597fd8e397b"),
  "name" : "trashed org",
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "recommendedProblems" : [],
  "lastModifiedDate" : ISODate("2019-07-01T17:23:27.862Z"),
  "isTrashed" : true,
  "createDate" : ISODate("2019-07-01T17:23:27.862Z")
},

/* 6 */
{
  "_id" : ObjectId("5c6df20a9466896b1c5d84af"),
  "name" : "Montgomery Elementary",
  "createdBy" : ObjectId("5b245760ac75842be3189525"),
  "lastModifiedBy" : null,
  "recommendedProblems" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : ISODate("2019-02-21T00:34:18.678Z")
},
];