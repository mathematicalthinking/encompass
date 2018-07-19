var Seeder = require('mongoose-data-seed').Seeder;
var Comment = require('../server/datasource/schemas').Comment;

var data = [
  {
    "_id": "53e12264b48b12793f000b84",
    "ancestors": [],
    "children": ["53e12507b48b12793f000b91"],
    "createDate": "2014-08-05T18:28:52.692Z",
    "createdBy": "53a43f7c729e9ef59ba7ebf2",
    "isTrashed": false,
    "label": "feedback",
    "parent": "53e11f21b48b12793f000b3b",
    "selection": "53e1223eb48b12793f000b81",
    "submission": "53e1156db48b12793f00042d",
    "text": " It helps to collaborate with someone!",
    "useForResponse": true,
    "workspace": "53e1156db48b12793f000442"
  },
  {
    "_id": "53e12507b48b12793f000b91",
    "label": "feedback",
    "text": "  It helps to collaborate with someone!",
    "createdBy": "53a43f7c729e9ef59ba7ebf2",
    "selection": "53e12503b48b12793f000b90",
    "parent": "53e12264b48b12793f000b84",
    "submission": "53e1156db48b12793f00042d",
    "workspace": "53e1156db48b12793f000442",
    "children": [],
    "ancestors": [],
    "useForResponse": true,
    "isTrashed": false,
    "createDate": "2014-08-05T18:40:07.063Z"
  },
  {
    "_id": "53e37a4ab48b12793f00104c",
    "label": "feedback",
    "text": "I spoke with Michael about the balance between the specific contexts we are working on and the teaching issues and that he could continue to help articulate the teaching issues even as there is a focus on implementing pows and the software",
    "createdBy": "529518daba1cd3d8c4013344",
    "selection": "53e379dfb48b12793f00104a",
    "submission": "53e36522729e9ef59ba7f4da",
    "workspace": "53e36522b48b12793f000d3b",
    "children": [],
    "ancestors": [],
    "useForResponse": true,
    "isTrashed": false,
    "createDate": "2014-08-07T13:08:26.396Z"
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
