var Seeder = require('mongoose-data-seed').Seeder;
var Folder = require('../server/datasource/schemas').Folder;

var data = [
  {
    _id: "53e11604b48b12793f0004ee",
    children: [],
    createdBy: "53d9a577729e9ef59ba7f118",
    editors: [],
    isTrashed: false,
    name: "Correct",
    taggings: [],
    workspace: "53e1156db48b12793f000442"
  },
      {
    _id: "53e1165eb48b12793f0005e7",
    children: [],
    createdBy: "53d9a577729e9ef59ba7f118",
    editors: [],
    isTrashed: false,
    name: "Incorrect",
    taggings: ["53e12518b48b12793f000b92"],
    workspace: "53e1156db48b12793f000442"
  },
      {
    _id: "53e1166db48b12793f0005e9",
    children: [],
    createdBy: "53d9a577729e9ef59ba7f118",
    editors: [],
    isTrashed: false,
    name: "Correct with no work",
    taggings: [],
    workspace: "53e1156db48b12793f000442"
  },
      {
    _id: "53e118f3b48b12793f000a41",
    children: [],
    createdBy: "53d9a577729e9ef59ba7f118",
    editors: [],
    isTrashed: false,
    name: "Reflections",
    taggings: ["53e1194bb48b12793f000a62", "53e11eceb48b12793f000b36", "53e11fa8b48b12793f000b48", "53e12250b48b12793f000b83"],
    workspace: "53e1156db48b12793f000442"
  },
      {
    _id: "53e11b0ab48b12793f000ab1",
    children: [],
    createdBy: "53d9a577729e9ef59ba7f118",
    editors: [],
    isTrashed: false,
    name: "I notice",
    taggings: ["53e11b5eb48b12793f000abb"],
    workspace: "53e1156db48b12793f000442"
  },
      {
    _id: "53e36a0bb48b12793f000d3c",
    children: ["53e36a31b48b12793f000d3d", "53e36ab5b48b12793f000d40", "53e37aa4b48b12793f00104f", "53e37af0b48b12793f001054", "53e37b47b48b12793f00105a", "53e37c3eb48b12793f00106a", "53e37da2b48b12793f00107a", "53e37e41b48b12793f00108b", "53e37e94b48b12793f00108e"],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "liked",
    taggings: [],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e36a31b48b12793f000d3d",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "scenario session",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e36a9bb48b12793f000d3f", "53e37492b48b12793f000d4b", "53e37715b48b12793f00103d", "53e37a87b48b12793f00104e", "53e37ad4b48b12793f001053", "53e37dc3b48b12793f00107e", "53e38accb48b12793f0010d5", "53e38ea3b48b12793f0010df"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e36ab5b48b12793f000d40",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "one on one",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e36ad3b48b12793f000d42"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e36cdbb48b12793f000d43",
    children: ["53e36d26b48b12793f000d45", "53e377b5b48b12793f001044", "53e37edbb48b12793f001091", "53e37f0fb48b12793f001096", "53e38a96b48b12793f0010d2"],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "Improve",
    taggings: [],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e36d26b48b12793f000d45",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "focus in session",
    parent: "53e36cdbb48b12793f000d43",
    taggings: ["53e36d2bb48b12793f000d46", "53e3772cb48b12793f00103f", "53e37e07b48b12793f001086", "53e38edcb48b12793f0010e5"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37466b48b12793f000d47",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "follow up",
    taggings: ["53e37478b48b12793f000d49", "53e37583b48b12793f000d57", "53e379e4b48b12793f00104b"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e374adb48b12793f000d4c",
    children: ["53e374d2b48b12793f000d4e", "53e3751ab48b12793f000d50", "53e37554b48b12793f000d54", "53e37758b48b12793f001040", "53e37b71b48b12793f00105d", "53e37c7cb48b12793f00106d", "53e37f38b48b12793f001099", "53e38e28b48b12793f0010d9"],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "wondering",
    taggings: [],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e374d2b48b12793f000d4e",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "student use",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e374dcb48b12793f000d4f"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e3751ab48b12793f000d50",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "thread view",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e37529b48b12793f000d52"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37554b48b12793f000d54",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "why teachers will use this",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e37560b48b12793f000d55", "53e38a6fb48b12793f0010cd"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37758b48b12793f001040",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "big skills/ideas",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e3777cb48b12793f001043"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e377b5b48b12793f001044",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "more work on ...",
    parent: "53e36cdbb48b12793f000d43",
    taggings: ["53e37deab48b12793f001082", "53e37df8b48b12793f001084"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37aa4b48b12793f00104f",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "reviewing PoWs",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37ab7b48b12793f001051", "53e37ba1b48b12793f001061", "53e37d05b48b12793f001075", "53e37e23b48b12793f001088", "53e38e5eb48b12793f0010dd"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37af0b48b12793f001054",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "looking at student work",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37b0eb48b12793f001056", "53e37cf5b48b12793f001073", "53e37d27b48b12793f001077", "53e37dd7b48b12793f001080", "53e38a53b48b12793f0010cb"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37b28b48b12793f001057",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "least useful",
    taggings: ["53e37b3bb48b12793f001059", "53e37be8b48b12793f001067", "53e37cc1b48b12793f001071", "53e38eb2b48b12793f0010e1"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37b47b48b12793f00105a",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "using for pd",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37b57b48b12793f00105c"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37b71b48b12793f00105d",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "get colleagues to use pows",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e37b8ab48b12793f00105f", "53e37c1ab48b12793f001069", "53e37d47b48b12793f001079", "53e38971b48b12793f0010ba"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37c3eb48b12793f00106a",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "conversation between",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37c69b48b12793f00106c"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37c7cb48b12793f00106d",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "how to teach problem solving",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e37c9bb48b12793f00106f"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37da2b48b12793f00107a",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "connections",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37db1b48b12793f00107c", "53e37e33b48b12793f00108a", "53e37f9cb48b12793f00109f", "53e38adbb48b12793f0010d8"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37e41b48b12793f00108b",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "online conversations",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37e4cb48b12793f00108d", "53e37f4eb48b12793f00109d", "53e37faab48b12793f0010a1"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37e94b48b12793f00108e",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "software future",
    parent: "53e36a0bb48b12793f000d3c",
    taggings: ["53e37ec4b48b12793f001090", "53e37efeb48b12793f001095", "53e38959b48b12793f0010b8"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37edbb48b12793f001091",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "pow software",
    parent: "53e36cdbb48b12793f000d43",
    taggings: ["53e37eeeb48b12793f001093"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37f0fb48b12793f001096",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "encompass software",
    parent: "53e36cdbb48b12793f000d43",
    taggings: ["53e37f19b48b12793f001098"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e37f38b48b12793f001099",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "software timeline/next features",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e37f43b48b12793f00109b", "53e38ec6b48b12793f0010e3"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e38a96b48b12793f0010d2",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "whole group summaries",
    parent: "53e36cdbb48b12793f000d43",
    taggings: ["53e38aa6b48b12793f0010d3"],
    workspace: "53e36522b48b12793f000d3b"
  },
      {
    _id: "53e38e28b48b12793f0010d9",
    children: [],
    createdBy: "529518daba1cd3d8c4013344",
    editors: [],
    isTrashed: false,
    name: "get good at anticipation",
    parent: "53e374adb48b12793f000d4c",
    taggings: ["53e38e46b48b12793f0010db"],
    workspace: "53e36522b48b12793f000d3b"
  },
  {
    "_id" : "5bb814d19885323f6d894975",
    "name" : "Reasonable",
    "workspace" : "5bb814d19885323f6d894974",
    "weight" : 100,
    "parent" : null,
    "taggings" : [],
    "children" : [
        "5bb814d19885323f6d894977",
        "5bb814d19885323f6d894978"
    ],
    "editors" : [],
    "lastModifiedDate" : "2018-10-06T01:44:45.142Z",
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:44:45.142Z"
  },
  {
    "_id" : "5bb814d19885323f6d894976",
    "name" : "Ridiculous",
    "workspace" : "5bb814d19885323f6d894974",
    "weight" : 200,
    "parent" : null,
    "taggings" : [],
    "children" : [],
    "editors" : [],
    "lastModifiedDate" : "2018-10-06T01:44:45.142Z",
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:44:45.142Z"
  },
  {
    "_id" : "5bb814d19885323f6d894977",
    "name" : "Correct",
    "workspace" : "5bb814d19885323f6d894974",
    "weight" : 101,
    "parent" : "5bb814d19885323f6d894975",
    "taggings" : [],
    "children" : [],
    "editors" : [],
    "lastModifiedDate" : "2018-10-06T01:44:45.142Z",
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:44:45.142Z"
  },
  {
    "_id" : "5bb814d19885323f6d894978",
    "name" : "Incorrect",
    "workspace" : "5bb814d19885323f6d894974",
    "weight" : 102,
    "parent" : "5bb814d19885323f6d894975",
    "taggings" : [],
    "children" : [],
    "editors" : [],
    "lastModifiedDate" : "2018-10-06T01:44:45.142Z",
    "isTrashed" : false,
    "createDate" : "2018-10-06T01:44:45.142Z"
  },
  {
    "_id" : "5bbdff5aecd6e597fd8dd0d7",
    "isTrashed" : true,
    "name": "trashed folder",
    "workspace": "5bb814d19885323f6d894974"
},
{
  "_id" : "5bec36c58c73047613e2f352",
  "name" : "Top Level 1",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [],
  "children" : [
      "5bec36dd8c73047613e2f355",
      "5bec36f78c73047613e2f357"
  ],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:52:53.832Z"
},
{
  "_id" : "5bec36ca8c73047613e2f353",
  "name" : "Top Level 2",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [],
  "children" : [
      "5bec37048c73047613e2f358"
  ],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:52:58.290Z"
},
{
  "_id" : "5bec36cd8c73047613e2f354",
  "name" : "Top Level 3",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : null,
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [
      "5bec38338c73047613e2f36b"
  ],
  "children" : [],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:53:01.979Z"
},
{
  "_id" : "5bec36dd8c73047613e2f355",
  "name" : "2nd Level 1",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : "5bec36c58c73047613e2f352",
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [],
  "children" : [
      "5bec36e98c73047613e2f356"
  ],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:53:17.755Z"
},
{
  "_id" : "5bec36e98c73047613e2f356",
  "name" : "3rd Level 1",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : "5bec36dd8c73047613e2f355",
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [],
  "children" : [],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:53:29.115Z"
},
{
  "_id" : "5bec36f78c73047613e2f357",
  "name" : "2nd Level 2",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : "5bec36c58c73047613e2f352",
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [],
  "children" : [],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:53:43.609Z"
},
{
  "_id" : "5bec37048c73047613e2f358",
  "name" : "2nd Level 3",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : "5bec36ca8c73047613e2f353",
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [
      "5bec38018c73047613e2f368",
      "5bec386a8c73047613e2f36d"
  ],
  "children" : [
      "5bec37108c73047613e2f359"
  ],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:53:56.969Z"
},
{
  "_id" : "5bec37108c73047613e2f359",
  "name" : "3rd Level 2",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : "5bec37048c73047613e2f358",
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [],
  "children" : [
      "5bec371f8c73047613e2f35a"
  ],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:54:08.048Z"
},
{
  "_id" : "5bec371f8c73047613e2f35a",
  "name" : "4th Level 1",
  "weight" : 0,
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "parent" : "5bec37108c73047613e2f359",
  "workspace" : "5bec36958c73047613e2f34e",
  "taggings" : [
      "5bec37f48c73047613e2f367"
  ],
  "children" : [],
  "editors" : [],
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:54:23.960Z"
}
];

var FoldersSeeder = Seeder.extend({
  shouldRun: function () {
    return Folder.count().exec().then(count => count === 0);
  },
  run: function () {
    return Folder.create(data);
  }
});

module.exports = FoldersSeeder;
