var Seeder = require('mongoose-data-seed').Seeder;
var Comment = require('../server/datasource/schemas').Comment;

var data = [
  {
    _id: "53e12264b48b12793f000b84",
    ancestors: [],
    children: ["53e12507b48b12793f000b91"],
    createDate: "2014-08-05T18:28:52.692Z",
    createdBy: "53a43f7c729e9ef59ba7ebf2",
    isTrashed: false,
    label: "feedback",
    selection: "53e1223eb48b12793f000b81",
    submission: "53e1156db48b12793f00042d",
    text: " It helps to collaborate with someone!",
    useForResponse: true,
    workspace: "53e1156db48b12793f000442"
  } ,{
    _id: "53e12507b48b12793f000b91",
    ancestors: [],
    children: [],
    createDate: "2014-08-05T18:40:07.063Z",
    createdBy: "53a43f7c729e9ef59ba7ebf2",
    isTrashed: false,
    label: "feedback",
    selection: "53e12503b48b12793f000b90",
    submission: "53e1156db48b12793f00042d",
    text: "  It helps to collaborate with someone!",
    useForResponse: true,
    workspace: "53e1156db48b12793f000442"
  }, {
    _id: "53e37a4ab48b12793f00104c",
    ancestors: [],
    children: [],
    createDate: "2014-08-07T13:08:26.396Z",
    createdBy: "529518daba1cd3d8c4013344",
    isTrashed: false,
    label: "feedback",
    selection: "53e379dfb48b12793f00104a",
    submission: "53e36522729e9ef59ba7f4da",
    text: "I spoke with Michael about the balance between the specific contexts we are working on and the teaching issues and that he could continue to help articulate the teaching issues even as there is a focus on implementing pows and the software",
    useForResponse: true,
    workspace: "53e36522b48b12793f000d3b"
  },
  {
    "_id" : "5bbb9d86c2aa0a1696840ceb",
    "label" : "feedback",
    "text" : "I notice that your explanation is vague.",
    "createdBy" : "5b4e4b48808c7eebc9f9e827",
    "lastModifiedBy" : null,
    "selection" : "5bbb9d57c2aa0a1696840ce9",
    "origin" : null,
    "parent" : null,
    "submission" : "5bb814d19885323f6d894973",
    "workspace" : "5bb814d19885323f6d894974",
    "children" : [],
    "ancestors" : [],
    "useForResponse" : true,
    "lastModifiedDate" : null,
    "isTrashed" : false,
    "createDate" : "2018-10-08T18:10:14.579Z"
},
{
  "_id" : "5bbbba86a6a7ee1a9a5ebc75",
  "label" : "wonder",
  "text" : "I wonder what this means...",
  "createdBy" : "5b7321ee59a672806ec903d5",
  "lastModifiedBy" : null,
  "selection" : "5bbbba75a6a7ee1a9a5ebc74",
  "origin" : null,
  "parent" : null,
  "submission" : "53e1156db48b12793f000414",
  "workspace" : "53e1156db48b12793f000442",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : false,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-10-08T20:13:58.108Z"
},
{
  "_id" : "5bbdfa74ecd6e597fd8d3cdf",
  "isTrashed" : true,
  "createdBy": "5b7321ee59a672806ec903d5",
  "selection" : "5bbbba75a6a7ee1a9a5ebc74",
  "submission" : "53e1156db48b12793f000414",
  "workspace" : "53e1156db48b12793f000442",
  "text": "trashed comment"
},
{
  "_id" : "5bec375d8c73047613e2f35e",
  "label" : "notice",
  "text" : "This is a notice comment on tracyc's brief summary.",
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "selection" : "5bec373d8c73047613e2f35c",
  "origin" : null,
  "parent" : null,
  "submission" : "5bec36958c73047613e2f34c",
  "workspace" : "5bec36958c73047613e2f34e",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : false,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:55:25.108Z"
},


{
  "_id" : "5bec37708c73047613e2f35f",
  "label" : "feedback",
  "text" : "This is a feedback comment on tracyc's explanation.",
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "selection" : "5bec37408c73047613e2f35d",
  "origin" : null,
  "parent" : null,
  "submission" : "5bec36958c73047613e2f34c",
  "workspace" : "5bec36958c73047613e2f34e",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : true,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:55:44.886Z"
},


{
  "_id" : "5bec37a08c73047613e2f364",
  "label" : "wonder",
  "text" : "This is a wonder comment on ashleyc's short answer.",
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "selection" : "5bec37838c73047613e2f361",
  "origin" : null,
  "parent" : null,
  "submission" : "5bec36958c73047613e2f34d",
  "workspace" : "5bec36958c73047613e2f34e",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : false,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:56:32.754Z"
},


{
  "_id" : "5bec37e38c73047613e2f366",
  "label" : "notice",
  "text" : "This is a notice comment on ashleyc's explanation.",
  "createdBy" : "5b4e4b48808c7eebc9f9e827",
  "lastModifiedBy" : null,
  "selection" : "5bec37a78c73047613e2f365",
  "origin" : null,
  "parent" : null,
  "submission" : "5bec36958c73047613e2f34d",
  "workspace" : "5bec36958c73047613e2f34e",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : false,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2018-11-14T14:57:39.094Z"
},
{
  "_id" : "5c6ec924a89be9751158ce0b",
  "label" : "wonder",
  "text" : "What did you mean here?",
  "createdBy" : "5c6eb49c9852e5710311d634",
  "lastModifiedBy" : null,
  "selection" : "5c6ec919a89be9751158ce0a",
  "origin" : null,
  "parent" : null,
  "submission" : "5c6ec5eba89be9751158ce08",
  "workspace" : "5c6ec5eba89be9751158ce06",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : false,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2019-02-21T15:52:04.920Z"
},
{
  "_id" : "5c6f426fb1ccdf96abab2701",
  "label" : "wonder",
  "text" : "What is your reasoning for this approach?",
  "createdBy" : "5c6f4075b1ccdf96abab26fe",
  "lastModifiedBy" : null,
  "selection" : "5c6f425bb1ccdf96abab2700",
  "origin" : null,
  "parent" : null,
  "submission" : "5c6ebc4a9852e5710311d63f",
  "workspace" : "5c6ebc4a9852e5710311d641",
  "children" : [],
  "ancestors" : [],
  "useForResponse" : false,
  "lastModifiedDate" : null,
  "isTrashed" : false,
  "createDate" : "2019-02-22T00:29:35.785Z"
}
];

var CommentsSeeder = Seeder.extend({
  shouldRun: function () {
    return Comment.count().exec().then(count => count === 0);
  },
  run: function () {
    return Comment.create(data);
  }
});

module.exports = CommentsSeeder;
