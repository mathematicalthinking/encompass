var Seeder = require('mongoose-data-seed').Seeder;
var Comment = require('../server/datasource/schemas').Comment;

var data = [{

}];

var CommentsSeeder = Seeder.extend({
  shouldRun: function () {
    return Comment.count().exec().then(count => count === 0);
  },
  run: function () {
    return Comment.create(data);
  }
});

module.exports = CommentsSeeder;
