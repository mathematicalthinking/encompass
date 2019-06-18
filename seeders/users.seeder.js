var Seeder = require('mongoose-data-seed').Seeder;
var User = require('../server/datasource/schemas').User;

var data = [/* 1 */
  {
      "_id" : "529646eae4bad7087700014d",
      "accountType" : "A",
      "name" : "",
      "username" : "jsilverman",
      "createdBy" : "529646eae4bad7087700014d",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "",
      "lastName" : ""
  },

  /* 2 */
  {
      "_id" : "529518daba1cd3d8c4013344",
      "accountType" : "A",
      "name" : "steve",
      "username" : "steve",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "createdBy" : "529518daba1cd3d8c4013344",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e1156db48b12793f000442"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "steve",
      "lastName" : ""
  },

  /* 3 */
  {
      "_id" : "52964714e4bad7087700014e",
      "accountType" : "A",
      "name" : "",
      "username" : "maxray",
      "createdBy" : "52964714e4bad7087700014e",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "",
      "lastName" : ""
  },

  /* 4 */
  {
      "_id" : "52a8823d729e9ef59ba7eb4a",
      "createdBy" : "52a8823d729e9ef59ba7eb4a",
      "accountType" : "A",
      "name" : null,
      "username" : "matraa57",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 5 */
  {
      "_id" : "52a88ae2729e9ef59ba7eb4b",
      "accountType" : "T",
      "organization" : "5b4a64a028e4b75919c28512",
      "name" : null,
      "seenTour" : null,
      "username" : "wes",
      "createdBy" : "52a88ae2729e9ef59ba7eb4b",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : false,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 6 */
  {
      "_id" : "52a88def729e9ef59ba7eb4c",
      "accountType" : "T",
      "name" : null,
      "seenTour" : null,
      "username" : "candice.roberts",
      "createdBy" : "52a88def729e9ef59ba7eb4c",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 7 */
  {
      "_id" : "52b05fae729e9ef59ba7eb4d",
      "accountType" : "A",
      "name" : "Valerie Klein",
      "seenTour" : null,
      "username" : "vklein",
      "createdBy" : "52b05fae729e9ef59ba7eb4d",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Valerie",
      "lastName" : "Klein"
  },

  /* 8 */
  {
      "_id" : "5370dc9c8f3e3d1f21000022",
      "accountType" : "T",
      "name" : "Daniel Lewis",
      "seenTour" : null,
      "username" : "dsl44",
      "createdBy" : "5370dc9c8f3e3d1f21000022",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Daniel",
      "lastName" : "Lewis"
  },

  /* 9 */
  {
      "_id" : "53a355a932f2863240000026",
      "accountType" : "T",
      "name" : "Harold",
      "seenTour" : null,
      "username" : "hle22",
      "createdBy" : "53a355a932f2863240000026",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Harold",
      "lastName" : ""
  },

  /* 10 */
  {
      "_id" : "53a43f7c729e9ef59ba7ebf2",
      "accountType" : "T",
      "name" : null,
      "seenTour" : null,
      "username" : "absvalteaching",
      "createdBy" : "53a43f7c729e9ef59ba7ebf2",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e1156db48b12793f000442"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 11 */
  {
      "_id" : "53d274a032f2863240001a71",
      "name" : "salejandre",
      "username" : "salejandre",
      "accountType" : "T",
      "seenTour" : null,
      "lastSeen" : null,
      "createdBy" : "53d274a032f2863240001a71",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "salejandre",
      "lastName" : ""
  },

  /* 12 */
  {
      "_id" : "53d9a577729e9ef59ba7f118",
      "accountType" : "T",
      "name" : null,
      "seenTour" : null,
      "username" : "mrs. wren",
      "createdBy" : "53d9a577729e9ef59ba7f118",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 13 */
  {
      "_id" : "5b1e758ba5d2157ef4c90b2d",
      "accountType" : "A",
      "name" : "superuser",
      "username" : "superuser",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "createdBy" : "5b1e758ba5d2157ef4c90b2d",
      "email" : "superuser@fakeemail.com",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-14T18:20:51.382Z",
      "firstName" : "superuser",
      "lastName" : ""
  },

  /* 14 */
  {
      "_id" : "5b1e7bf9a5d2157ef4c911a6",
      "accountType" : "T",
      "name" : "Dr. Rex",
      "username" : "drex",
      "organization" : "5b4a64a028e4b75919c28512",
      "createdBy" : "5b1e7bf9a5d2157ef4c911a6",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5bec36958c73047613e2f34e"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Dr.",
      "lastName" : "Rex"
  },

  /* 15 */
  {
      "_id" : "5b1e7ca6a5d2157ef4c91210",
      "accountType" : "T",
      "name" : "Nope",
      "username" : "nope",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "createdBy" : "5b1e7ca6a5d2157ef4c91210",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : false,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-14T18:20:51.382Z",
      "firstName" : "Nope",
      "lastName" : ""
  },

  /* 16 */
  {
      "_id" : "5b245760ac75842be3189525",
      "username" : "rick",
      "name" : "Rick Sanchez",
      "email" : "rick@gmail.com",
      "organization" : "5b4a64a028e4b75919c28512",
      "password" : "$2a$08$/c9pHIH086E5qc.Mxh04geJ62xygISgF9C7eQnMzsHoukmpZ/QcX.",
      "accountType" : "A",
      "actingRole" : "teacher",
      "createdBy" : "5b245760ac75842be3189525",
      "seenTour" : "2018-11-17T10:20:51.382Z",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e1156db48b12793f000442",
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2019-06-18T15:06:41.262Z",
      "firstName" : "Rick",
      "lastName" : "Sanchez"
  },

  /* 17 */
  {
      "_id" : "5b3688218610e3bfecca403c",
      "accountType" : "S",
      "username" : "testUser",
      "organization" : "5b4a64a028e4b75919c28512",
      "createdBy" : "5b245841ac75842be3189526",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [
          "5b27fa71d522ff21c58d40b8"
      ],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 18 */
  {
      "_id" : "5b368afdca1375a94fabde39",
      "accountType" : "S",
      "organization" : "5b4a64a028e4b75919c28512",
      "name" : "student1",
      "username" : "student1",
      "createdBy" : "5b245841ac75842be3189526",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [
          "5b1e7abfa5d2157ef4c910b8"
      ],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-16T10:20:51.382Z",
      "firstName" : "student1",
      "lastName" : ""
  },

  /* 19 */
  {
      "_id" : "5b72273c5b50ea3fe3d01a0b",
      "username" : "alice42",
      "accountType" : "T",
      "actingRole" : "teacher",
      "name" : "Alice Carrol",
      "organization" : "5b4a64a028e4b75919c28512",
      "resetPasswordToken" : "64a9360d9bf51cfc85662fd845c964680d39768e",
      "resetPasswordExpires" : "2088-08-14T21:13:47.107Z",
      "password" : "$2a$08$Puko.4Ukg3fUVSfQsyhlauvFJ84/ymtidiL8qablVfic59zzC4gFi",
      "createdBy" : "5b72273c5b50ea3fe3d01a0b",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Alice",
      "lastName" : "Carrol"
  },

  /* 20 */
  {
      "_id" : "5b72278b5b50ea3fe3d01a34",
      "username" : "eeyore",
      "accountType" : "T",
      "actingRole" : "teacher",
      "name" : "Ian M.",
      "resetPasswordToken" : "64f9r60x9b2513f785q62fd845c964680d39768e",
      "resetPasswordExpires" : "2018-08-12T21:13:47.107Z",
      "password" : "$2a$08$Puko.4Ukg3yUVSfQsyhlauvFJ/4/ymtidiL8qab.Vfic59zzC4gFi",
      "organization" : "5b4a64a028e4b75919c28512",
      "createdBy" : "5b72278b5b50ea3fe3d01a34",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Ian",
      "lastName" : "M."
  },

  /* 21 */
  {
      "_id" : "5b72e05ba459749f7d9c1709",
      "username" : "perryz",
      "accountType" : "T",
      "actingRole" : "teacher",
      "name" : "Perry Zeller",
      "email" : "encmath2@gmail.com",
      "organization" : "5b4a64a028e4b75919c28512",
      "confirmEmailToken" : "64y9r60x9b2513f785q62fdt45c924630339968e",
      "confirmEmailExpires" : "2088-08-12T21:13:47.107Z",
      "password" : "$2a$12$q1.0QW/dcY.OzwqfkzKLf.D.4i02m4Ypa0fHTqcqivJD.bxLn6NLa",
      "createdBy" : "5b72e05ba459749f7d9c1709",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z",
      "firstName" : "Perry",
      "lastName" : "Zeller"
  },

  /* 22 */
  {
      "_id" : "5b72e6465b50ea3fe3d1623c",
      "username" : "perryu",
      "accountType" : "T",
      "actingRole" : "teacher",
      "name" : "Perry Uller",
      "email" : "encmath2@gmail.com",
      "organization" : "5b4a64a028e4b75919c28512",
      "confirmEmailToken" : "62y9f60x9b2513f785f62fdt41f924630339968f",
      "confirmEmailExpires" : "2018-08-12T21:13:47.107Z",
      "password" : "$2a112$11.0QW/dcY.O/wqfkzKLf.D.4i02m4Ypa0fHTqcqivJD.bxLn6NLa",
      "createdBy" : "5b72e6465b50ea3fe3d1623c",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-14T18:20:51.382Z",
      "firstName" : "Perry",
      "lastName" : "Uller"
  },

  /* 23 */
  {
      "_id" : "5b7321ee59a672806ec903d5",
      "name" : "PD Admin",
      "email" : "pdadmin@test.com",
      "organization" : "5b4a64a028e4b75919c28512",
      "location" : "Philadelphia, PA",
      "username" : "pdadmin",
      "actingRole" : "teacher",
      "password" : "$2a$12$nQafJwfxx19P2vyBhDLXUeDFNdZU81t1eosZEvs.plyCP1HNSZFtW",
      "accountType" : "P",
      "lastSeen" : "2018-08-16T20:19:26.457Z",
      "createdBy" : "5b245760ac75842be3189525",
      "seenTour" : "2018-11-18T10:20:51.382Z",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5bec36958c73047613e2f34e"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-08-14T18:20:51.382Z",
      "isTrashed" : false,
      "createDate" : "2018-08-14T18:20:51.382Z",
      "firstName" : "PD",
      "lastName" : "Admin"
  },

  /* 24 */
  {
      "_id" : "52964653e4bad7087700014b",
      "name" : "testfix",
      "email" : "testfix@test.com",
      "organization" : "5b4a64a028e4b75919c28512",
      "location" : "Philadelphia, PA",
      "username" : "testfix",
      "password" : "$2a$12$nQafJwfxx19P2vyBhDLXUeDFNdZU81t1eosZEvs.plyCP1HNSZFtW",
      "accountType" : "T",
      "lastSeen" : "2018-08-16T20:19:26.457Z",
      "actingRole" : "teacher",
      "createdBy" : "5b7321ee59a672806ec903d5",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "53e36522b48b12793f000d3b"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-08-14T18:20:51.382Z",
      "isTrashed" : false,
      "createDate" : "2018-08-14T18:20:51.382Z",
      "firstName" : "testfix",
      "lastName" : ""
  },

  /* 25 */
  {
      "_id" : "52a695c2cc319831440007d0",
      "isAdmin" : false,
      "lastSeen" : "2015-03-22T12:38:55.745Z",
      "name" : "",
      "seenTour" : null,
      "username" : "mr_stadel",
      "accountType" : "T",
      "createdBy" : "52a695c2cc319831440007d0",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-08-27T19:17:23.796Z",
      "isTrashed" : false,
      "createDate" : "2014-08-04T15:55:20.985Z",
      "firstName" : "",
      "lastName" : ""
  },

  /* 26 */
  {
      "_id" : "5ba7bedd2b7ba22c38a554fc",
      "confirmEmailExpires" : "2018-09-24T16:27:09.309Z",
      "confirmEmailToken" : "b0d1c5208859919cdf1dd0b55bbe2e5de5c88e2c",
      "name" : "Tim Pool",
      "email" : "tpool@fakeemail.com",
      "organization" : "5b4e4b48808c7eebc9f9e828",
      "location" : "Philadelphia, PA",
      "username" : "tpool",
      "password" : "$2a$12$WA5cZStBrgopuQ1xD6RS2eO9EtNYHiBiQp137DdWgEldG5SSIpSJW",
      "requestReason" : "Professional Development",
      "accountType" : "P",
      "actingRole" : "teacher",
      "lastSeen" : "2018-09-23T16:27:12.329Z",
      "authorizedBy" : "5b245760ac75842be3189525",
      "createdBy" : null,
      "googleId" : null,
      "lastModifiedBy" : "5b245760ac75842be3189525",
      "organizationRequest" : null,
      "seenTour" : null,
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-23T16:27:52.131Z",
      "isTrashed" : false,
      "createDate" : "2018-09-23T14:55:15.655Z",
      "firstName" : "Tim",
      "lastName" : "Pool"
  },

  /* 27 */
  {
      "_id" : "5bbe04dbecd6e597fd8fc177",
      "username" : "trasheduser",
      "accountType" : "T",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : false,
      "isAuthorized" : false,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : true,
      "createDate" : "2019-06-18T15:06:41.262Z"
  },

  /* 28 */
  {
      "_id" : "5c6eb45d9852e5710311d633",
      "confirmEmailExpires" : "2019-02-22T14:23:25.864Z",
      "confirmEmailToken" : "3a9571cf158344cb6c621949bcfc1ceef6865903",
      "name" : "Alex Smith",
      "email" : "alex@mtgfake.com",
      "organization" : "5c6df20a9466896b1c5d84af",
      "location" : "MD",
      "username" : "mtgteacher",
      "password" : "$2a$12$jX8lx.4o2CMShsuMQHjfueR7sdf5ORrf3RGWO0yeHHMeLJoL55r2y",
      "accountType" : "T",
      "createdBy" : "5b245760ac75842be3189525",
      "authorizedBy" : "5b245760ac75842be3189525",
      "actingRole" : "teacher",
      "avatar" : "https://ui-avatars.com/api/?rounded=true&color=ffffff&background=fcc2cd&name=Alex+Smith",
      "googleId" : null,
      "lastModifiedBy" : "5b245760ac75842be3189525",
      "lastSeen" : "2019-02-21T14:26:33.735Z",
      "organizationRequest" : null,
      "requestReason" : null,
      "seenTour" : "2019-02-21T14:23:33.447Z",
      "socketId" : "gRmVdk-Wo5RXOewnAAAB",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-21T14:23:34.424Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T13:00:49.191Z",
      "firstName" : "Alex",
      "lastName" : "Smith"
  },

  /* 29 */
  {
      "_id" : "5c6f4032b1ccdf96abab26fd",
      "confirmEmailExpires" : "2019-02-23T00:20:02.994Z",
      "confirmEmailToken" : "02291f71aad0968537c44d61d5dda21453ba4786",
      "name" : "Ashley Mays",
      "email" : "ampd@fakeemail.com",
      "organization" : "5c6f4032b1ccdf96abab26fc",
      "location" : "CA",
      "username" : "mentorpd",
      "password" : "$2a$12$suZ74.AaY7AFS9sasRtqSOrUsmhFwOiAImP83i6CC0.EDcs1dHoaC",
      "accountType" : "P",
      "createdBy" : "5b245760ac75842be3189525",
      "authorizedBy" : "5b245760ac75842be3189525",
      "actingRole" : "teacher",
      "avatar" : "https://ui-avatars.com/api/?rounded=true&color=ffffff&background=f9ada9&name=Ashley+Mays",
      "googleId" : null,
      "lastModifiedBy" : "5b245760ac75842be3189525",
      "lastSeen" : "2019-02-22T00:23:05.672Z",
      "organizationRequest" : null,
      "requestReason" : null,
      "seenTour" : null,
      "socketId" : "1sSQ2ZbQn4-2eSV9AAAD",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5c6ebc4a9852e5710311d641"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-22T00:20:10.316Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T23:14:33.392Z",
      "firstName" : "Ashley",
      "lastName" : "Mays"
  },

  /* 30 */
  {
      "_id" : "5c6f4075b1ccdf96abab26fe",
      "confirmEmailExpires" : "2019-02-23T00:21:09.802Z",
      "confirmEmailToken" : "013f431a524e78f172c09fbed708b1351e5ebc16",
      "name" : "Pat Jones",
      "email" : "pjt@fakeemail.com",
      "organization" : "5c6f4032b1ccdf96abab26fc",
      "location" : "CA",
      "username" : "mentort1",
      "password" : "$2a$12$wMVOnFgZlQpX6nBRQ9MlNe24I/u.i/nb3fN4XZSyAsnqX48KEkQdi",
      "accountType" : "T",
      "createdBy" : "5c6f4032b1ccdf96abab26fd",
      "authorizedBy" : "5c6f4032b1ccdf96abab26fd",
      "actingRole" : "teacher",
      "avatar" : "https://ui-avatars.com/api/?rounded=true&color=ffffff&background=e8f79b&name=Pat+Jones",
      "googleId" : null,
      "lastModifiedBy" : "5c6f4032b1ccdf96abab26fd",
      "lastSeen" : null,
      "organizationRequest" : null,
      "requestReason" : null,
      "seenTour" : "2019-02-21T23:56:33.392Z",
      "socketId" : null,
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5c6ebc4a9852e5710311d641"
      ],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-22T00:21:13.789Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T23:14:33.392Z",
      "firstName" : "Pat",
      "lastName" : "Jones"
  },

  /* 31 */
  {
      "_id" : "5c6f40deb1ccdf96abab26ff",
      "confirmEmailExpires" : "2019-02-23T00:22:54.736Z",
      "confirmEmailToken" : "78935e8863e019c7dc24d9b17c26d3a1e9c0cb0e",
      "name" : "Jack Madison",
      "email" : "jmt2@fakeemail.com",
      "organization" : "5c6f4032b1ccdf96abab26fc",
      "location" : "CA",
      "username" : "mentort2",
      "password" : "$2a$12$VGI3xp8WTtlOmEcPjmWbKOIKvVVyEfGElVwhQFSs31LnW.Q2hAw7i",
      "accountType" : "T",
      "createdBy" : "5c6f4032b1ccdf96abab26fd",
      "authorizedBy" : "5c6f4032b1ccdf96abab26fd",
      "actingRole" : "teacher",
      "avatar" : "https://ui-avatars.com/api/?rounded=true&color=ffffff&background=dcf279&name=Jack+Madison",
      "googleId" : null,
      "lastModifiedBy" : "5c6f4032b1ccdf96abab26fd",
      "lastSeen" : null,
      "organizationRequest" : null,
      "requestReason" : null,
      "seenTour" : null,
      "socketId" : null,
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-22T00:23:05.662Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T23:14:33.392Z",
      "firstName" : "Jack",
      "lastName" : "Madison"
  },

  /* 32 */
  {
      "_id" : "5b245841ac75842be3189526",
      "username" : "morty",
      "accountType" : "T",
      "organization" : "5b4a64a028e4b75919c28512",
      "password" : "$2a$08$Puko.4Ukg3fUVSfQsyhlauvEJ84/ymUidiL7xablVfic59zzC4gFi",
      "actingRole" : "teacher",
      "createdBy" : "5b245841ac75842be3189526",
      "seenTour" : "2018-11-17T10:24:51.382Z",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [
          {
              "sectionId" : "5b913e723add43b868ae9804",
              "role" : "teacher"
          },
      ],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-17T10:20:51.382Z"
  },

  /* 33 */
  {
      "_id" : "5b4e5180a2eed65e2434d475",
      "accountType" : "S",
      "username" : "testUser2",
      "organization" : "5b4a64a028e4b75919c28512",
      "createdBy" : "5b245760ac75842be3189525",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [
          {
              "role" : "student",
              "sectionId" : "5b9149a32ecaf7c30dd4748f"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-06-18T15:06:41.262Z",
      "isTrashed" : false,
      "createDate" : "2018-08-12T18:20:51.382Z"
  },

  /* 34 */
  {
      "_id" : "5b913ebe3add43b868ae9807",
      "organization" : "5b4a64a028e4b75919c28512",
      "username" : "jamie4",
      "password" : "$2a$12$9yHQw56mEBj/3RdMj/1ohuF1pjxk9s.Jq6fBGAYqBs/wPwVyAvYR2",
      "accountType" : "S",
      "createdBy" : "5b245841ac75842be3189526",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5b9146a83add43b868ae9809"
      ],
      "answers" : [],
      "sections" : [
          {
              "sectionId" : "5b913e723add43b868ae9804",
              "role" : "student"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-05T20:57:31.730Z",
      "isTrashed" : false,
      "createDate" : "2018-09-05T20:57:31.730Z"
  },

  /* 35 */
  {
      "_id" : "5b913eaf3add43b868ae9806",
      "organization" : "5b4a64a028e4b75919c28512",
      "username" : "sam3",
      "password" : "$2a$12$BncFqBAu92VeyuKX7WUQjuDREWncoR6BgG0.3aZOulruEs5iwb7qS",
      "accountType" : "S",
      "createdBy" : "5b245841ac75842be3189526",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5b9146a83add43b868ae9809"
      ],
      "answers" : [],
      "sections" : [
          {
              "sectionId" : "5b913e723add43b868ae9804",
              "role" : "student"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-05T20:57:31.730Z",
      "isTrashed" : false,
      "createDate" : "2018-09-05T20:57:31.730Z"
  },

  /* 36 */
  {
      "_id" : "5b913ea33add43b868ae9805",
      "organization" : "5b4a64a028e4b75919c28512",
      "username" : "alex8",
      "password" : "$2a$12$VJaCSw8ISla5ntkNL07qjuF.rU/ZV3xgmbnAyEbyUEN.acBOnavym",
      "accountType" : "S",
      "createdBy" : "5b245841ac75842be3189526",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5b9146a83add43b868ae9809"
      ],
      "answers" : [],
      "sections" : [
          {
              "sectionId" : "5b913e723add43b868ae9804",
              "role" : "student"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-05T20:57:31.730Z",
      "isTrashed" : false,
      "createDate" : "2018-09-05T20:57:31.730Z"
  },

  /* 37 */
  {
      "_id" : "5b9149f52ecaf7c30dd47491",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "username" : "morganf",
      "password" : "$2a$12$bJ6SE4Y7KTAt1VtatrwSku2Y.wqto0JQKUjJvkvwGHkoelr2tOKX.",
      "accountType" : "S",
      "createdBy" : "5b4e4b48808c7eebc9f9e827",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5b91743a3da5efca74705773"
      ],
      "answers" : [],
      "sections" : [
          {
              "sectionId" : "5b9149a32ecaf7c30dd4748f",
              "role" : "student"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-06T15:30:21.278Z",
      "isTrashed" : false,
      "createDate" : "2018-09-06T15:30:21.278Z"
  },

  /* 38 */
  {
      "_id" : "5b9149c22ecaf7c30dd47490",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "username" : "ashleyc",
      "password" : "$2a$12$X7PKqTfa/ydePAKPNGGd4ObP9W6NSE34Cdwf3dYpT2BJh3oA2mSda",
      "accountType" : "S",
      "createdBy" : "5b4e4b48808c7eebc9f9e827",
      "history" : [],
      "notifications" : [
          "5d08fe0261d1f2a863c33ad4"
      ],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5bec36958c73047613e2f34e"
      ],
      "assignments" : [
          "5b91743a3da5efca74705773"
      ],
      "answers" : [
          "5bec35898c73047613e2f34b"
      ],
      "sections" : [
          {
              "sectionId" : "5b9149a32ecaf7c30dd4748f",
              "role" : "student"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-06T15:30:21.278Z",
      "isTrashed" : false,
      "createDate" : "2018-09-06T15:30:21.278Z"
  },

  /* 39 */
  {
      "_id" : "5b914a102ecaf7c30dd47492",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "username" : "tracyc",
      "name" : "Tracy Collins",
      "password" : "$2a$12$svhAmCvhB2Q0iSJlwMyH6.2q4nJKLBvnGAVfXRVqkXDJKotpWd4Wq",
      "accountType" : "S",
      "createdBy" : "5b4e4b48808c7eebc9f9e827",
      "history" : [],
      "notifications" : [
          "5d08fe0261d1f2a863c33ad5"
      ],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5bec36958c73047613e2f34e"
      ],
      "assignments" : [
          "5b91743a3da5efca74705773"
      ],
      "answers" : [
          "5bb813fc9885323f6d894972"
      ],
      "sections" : [
          {
              "sectionId" : "5b9149a32ecaf7c30dd4748f",
              "role" : "student"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-06T15:30:21.278Z",
      "isTrashed" : false,
      "createDate" : "2018-09-06T15:30:21.278Z",
      "firstName" : "Tracy",
      "lastName" : "Collins"
  },

  /* 40 */
  {
      "_id" : "5b914a802ecaf7c30dd47493",
      "confirmEmailExpires" : "2018-09-07T15:40:48.142Z",
      "confirmEmailToken" : "329ff40a5d27344c6681d2d93bc1f628d71501fe",
      "name" : "Taylor Taylorson",
      "email" : "taylor@fakeemail.com",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "location" : "Conshohocken, PA",
      "username" : "teachertaylor",
      "password" : "$2a$12$p.4iz7z06yQdV4kyUAmq6.jG2Z0CHCCoyQppY21x8j5WhmcyDLxPG",
      "accountType" : "T",
      "createdBy" : "5b245760ac75842be3189525",
      "authorizedBy" : "5b245760ac75842be3189525",
      "actingRole" : "teacher",
      "lastModifiedBy" : null,
      "lastSeen" : null,
      "organizationRequest" : null,
      "requestReason" : null,
      "seenTour" : "2018-11-13T10:20:51.382Z",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [
          {
              "role" : "teacher",
              "sectionId" : "5b9149a32ecaf7c30dd4748f"
          },
      ],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-06T15:30:21.278Z",
      "isTrashed" : false,
      "createDate" : "2018-09-06T15:30:21.278Z",
      "firstName" : "Taylor",
      "lastName" : "Taylorson"
  },

  /* 41 */
  {
      "_id" : "5b4e4b48808c7eebc9f9e827",
      "name" : "Summer Smith",
      "email" : "ssmith@fakeemail.com",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "location" : "Conshohocken, PA",
      "username" : "ssmith",
      "password" : "$2a$12$rAJwBMeVR5RXPhKGGgMRdOM/OaOREMrsIPE2HZcBI0PCW2cME4IFi",
      "requestReason" : "Professional Development",
      "accountType" : "T",
      "actingRole" : "teacher",
      "lastSeen" : "2018-09-06T15:41:14.918Z",
      "authorizedBy" : null,
      "createdBy" : "5b4e4b48808c7eebc9f9e827",
      "lastModifiedBy" : "5b245760ac75842be3189525",
      "seenTour" : "2018-11-22T10:20:51.382Z",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [],
      "answers" : [],
      "sections" : [
          {
              "role" : "teacher",
              "sectionId" : "5b9149a32ecaf7c30dd4748f"
          },
      ],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-06T15:36:31.451Z",
      "isTrashed" : false,
      "createDate" : "2018-09-06T15:30:21.278Z",
      "firstName" : "Summer",
      "lastName" : "Smith"
  },

  /* 42 */
  {
      "_id" : "5b99146e25b620610ceead75",
      "confirmEmailExpires" : "2018-09-13T13:28:14.336Z",
      "confirmEmailToken" : "877b58517e38015753f98d0e7f6594b31c3cc162",
      "name" : "Al Allison",
      "email" : "al@fakeemail.com",
      "organization" : "5b4e4d5f808c7eebc9f9e82c",
      "location" : "Conshohocken, PA",
      "username" : "actingstudent",
      "password" : "$2a$12$gPUKBtiXwchWW5Y/aBApcei3J69hV23pZDBQOFf4phK98uFdIzcwW",
      "requestReason" : "PD",
      "accountType" : "T",
      "actingRole" : "student",
      "lastSeen" : "2018-09-12T13:28:36.769Z",
      "authorizedBy" : null,
      "createdBy" : null,
      "lastModifiedBy" : "5b245760ac75842be3189525",
      "seenTour" : "2018-11-14T10:20:51.382Z",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [
          "5bec36958c73047613e2f34e"
      ],
      "assignments" : [
          "5b91743a3da5efca74705773"
      ],
      "answers" : [],
      "sections" : [
          {
              "role" : "student",
              "sectionId" : "5b9149a32ecaf7c30dd4748f"
          },
      ],
      "isEmailConfirmed" : true,
      "isAuthorized" : true,
      "lastModifiedDate" : "2018-09-12T13:29:14.361Z",
      "isTrashed" : false,
      "createDate" : "2018-09-12T02:41:40.407Z",
      "firstName" : "Al",
      "lastName" : "Allison"
  },

  /* 43 */
  {
      "_id" : "5c6eb49c9852e5710311d634",
      "name" : "Kerry Davis",
      "organization" : "5c6df20a9466896b1c5d84af",
      "username" : "mtgstudent1",
      "password" : "$2a$12$VHxAuasK/L/9F/vJiAXtNewhM9xCAYXrJtbtG41M25QAoXkXb.8o.",
      "accountType" : "S",
      "createdBy" : "5c6eb45d9852e5710311d633",
      "authorizedBy" : "5c6eb45d9852e5710311d633",
      "history" : [],
      "notifications" : [],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5c6eb5199852e5710311d638"
      ],
      "answers" : [
          "5c6eb7f89852e5710311d639"
      ],
      "sections" : [
          {
              "role" : "student",
              "sectionId" : "5c6eb4d49852e5710311d637"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-21T13:00:49.191Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T13:00:49.191Z",
      "firstName" : "Kerry",
      "lastName" : "Davis"
  },

  /* 44 */
  {
      "_id" : "5c6eb4ac9852e5710311d635",
      "name" : "Jamie Baker",
      "organization" : "5c6df20a9466896b1c5d84af",
      "username" : "mtgstudent2",
      "password" : "$2a$12$n4fBSZGf87HDoHIZiS1IiuMkcMjPAHFtORvQ07vS6CeO94Qe4SPR.",
      "accountType" : "S",
      "createdBy" : "5c6eb45d9852e5710311d633",
      "authorizedBy" : "5c6eb45d9852e5710311d633",
      "history" : [],
      "notifications" : [
          "5d08fe0261d1f2a863c33ad2"
      ],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5c6eb5199852e5710311d638"
      ],
      "answers" : [
          "5c6eb8319852e5710311d63c"
      ],
      "sections" : [
          {
              "role" : "student",
              "sectionId" : "5c6eb4d49852e5710311d637"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-21T13:00:49.191Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T13:00:49.191Z",
      "firstName" : "Jamie",
      "lastName" : "Baker"
  },

  /* 45 */
  {
      "_id" : "5c6eb4c19852e5710311d636",
      "name" : "Micah Anderson",
      "organization" : "5c6df20a9466896b1c5d84af",
      "username" : "mtgstudent3",
      "password" : "$2a$12$ecQid5ydhJfIIpwp9R4bROEu5SIQ/VS81MweEymT07Jp2vfy/aBVq",
      "accountType" : "S",
      "createdBy" : "5c6eb45d9852e5710311d633",
      "authorizedBy" : "5c6eb45d9852e5710311d633",
      "history" : [],
      "notifications" : [
          "5d08fe0261d1f2a863c33ad3"
      ],
      "hiddenWorkspaces" : [],
      "collabWorkspaces" : [],
      "assignments" : [
          "5c6eb5199852e5710311d638"
      ],
      "answers" : [
          "5c6eb85d9852e5710311d63d"
      ],
      "sections" : [
          {
              "role" : "student",
              "sectionId" : "5c6eb4d49852e5710311d637"
          },
      ],
      "isEmailConfirmed" : false,
      "isAuthorized" : true,
      "lastModifiedDate" : "2019-02-21T13:00:49.191Z",
      "isTrashed" : false,
      "createDate" : "2019-02-21T13:00:49.191Z",
      "firstName" : "Micah",
      "lastName" : "Anderson"
  },];

var UsersSeeder = Seeder.extend({
  shouldRun: function () {
    return User.count().exec().then(count => count === 0);
  },
  run: function () {
    return User.create(data);
  }
});

module.exports = UsersSeeder;