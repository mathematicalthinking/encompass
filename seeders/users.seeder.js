var Seeder = require('mongoose-data-seed').Seeder;
var User = require('../server/datasource/schemas').User;

var data = [
  {
    "_id": "529518daba1cd3d8c4013344",
    "isAdmin": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "5b8d3ded-cc7f-4aa7-9570-06077d799e81",
    "name": "test name",
    "username": "steve",
    "createdBy": null,
    "sections": [],
    "assignments": []
  }, {
    "_id": "529646eae4bad7087700014d",
    "isAdmin": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "42043bb2-ac33-49bf-abf1-e69d3c81437b",
    "name": "",
    "username": "jsilverman"
  }, {
    "_id": "52964714e4bad7087700014e",
    "isAdmin": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "12430982-a2c3-420c-b5d8-78a1f92fd8f6",
    "name": "",
    "username": "maxray"
  }, {
    "_id": "52a8823d729e9ef59ba7eb4a",
    "createdBy": null,
    "isAdmin": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "5574b5f9-71e1-4202-9c7c-90e252cd6306",
    "name": null,
    "username": "matraa57"
  }, {
    "_id": "52a88ae2729e9ef59ba7eb4b",
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "b2134b34-6367-4f58-a385-717c297e70ba",
    "name": null,
    "seenTour": null,
    "username": "wes"
  }, {
    "_id": "52a88def729e9ef59ba7eb4c",
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "149b31e3-b977-45ea-8534-68aead8b4444",
    "name": null,
    "seenTour": null,
    "username": "candice.roberts"
  }, {
    "_id": "52b05fae729e9ef59ba7eb4d",
    "isAdmin": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "a07e247a-618a-4ac7-a6df-e7ed929aa963",
    "name": "Valerie Klein",
    "seenTour": null,
    "username": "vklein"
  }, {
    "_id": "5370dc9c8f3e3d1f21000022",
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "ffc2237f-ff27-43b1-8c48-fcd9fa0db8ab",
    "name": "Daniel Lewis",
    "seenTour": null,
    "username": "dsl44"
  }, {
    "_id": "53a355a932f2863240000026",
    "createDate": null,
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "4aaf0c43-ba27-4201-9e0a-28990984f62a",
    "name": "Harold",
    "seenTour": null,
    "username": "hle22"
  }, {
    "_id": "53a43f7c729e9ef59ba7ebf2",
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "cba4a0d2-a06e-4ac5-92fd-67fcb772da34",
    "name": null,
    "seenTour": null,
    "username": "absvalteaching",
    "assignments": [],
    "sections": []
  }, {
    "_id": "53d274a032f2863240001a71",
    "name": "salejandre",
    "username": "salejandre",
    "isAdmin": false,
    "isAuthorized": true,
    "seenTour": null,
    "lastSeen": null,
    "isTrashed": false,
    "createDate": null
  }, {
    "_id": "53d9a577729e9ef59ba7f118",
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "3933f032-fa60-469a-b4ec-098083a51921",
    "name": null,
    "seenTour": null,
    "username": "mrs. wren"
  }, {
    "_id": "5b1e758ba5d2157ef4c90b2d",
    "isAdmin": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "test-admin-key",
    "name": "superuser",
    "username": "superuser",
    "assignments": [],
    "sections": []
  }, {
    "_id": "5b1e7bf9a5d2157ef4c911a6",
    "isAdmin": false,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "test-teacher-key",
    "name": "Dr. Rex",
    "username": "drex",
    "assignments": [],
    "sections": [],
  }, {
    "_id": "5b1e7ca6a5d2157ef4c91210",
    "isAdmin": false,
    "isAuthorized": false,
    "isTrashed": false,
    "key": "test-unauth-key",
    "name": "Nope",
    "username": "nope",
    "assignments": [],
    "sections": []
  }, {
    "_id": "5b245760ac75842be3189525",
    "username": "rick",
    "organization": "5b4a64a028e4b75919c28512",
    "password": "$2a$08$/c9pHIH086E5qc.Mxh04geJ62xygISgF9C7eQnMzsHoukmpZ/QcX.",
    "isAuthorized": true,
    "isAdmin": true,
    "assignments": [],
    "sections": [],
    "isTrashed": false,
  }, {
    "_id": "5b245841ac75842be3189526",
    "username": "morty",
    "password": "$2a$08$Puko.4Ukg3fUVSfQsyhlauvEJ84/ymUidiL7xablVfic59zzC4gFi",
    "isAuthorized": true,
    "assignments": [],
    "sections": [],
    "isTrashed": false,
  }, {
    "_id": "5b3688218610e3bfecca403c",
    "username": "testUser",
    "assignments": [],
    "sections": [],
    "isTrashed": false,
  }, {
    "_id": "5b368afdca1375a94fabde39",
    "isAdmin": true,
    "isStudent": true,
    "isAuthorized": true,
    "isTrashed": false,
    "key": "5b8d3ded-cc7f-4aa7-9570-06077d799e81",
    "name": "student1",
    "username": "student1",
    "createdBy": null,
    "sections": [],
    "assignments": []
  }, {
    "_id": "5b4e5180a2eed65e2434d475",
    "username": "testUser2",
    "assignments": [],
    "answers": [],
    "sections": [],
    "isTrashed": false,
  }

];

var UsersSeeder = Seeder.extend({
  shouldRun: function () {
    return User.count().exec().then(count => count === 0);
  },
  run: function () {
    return User.create(data);
  }
});

module.exports = UsersSeeder;
