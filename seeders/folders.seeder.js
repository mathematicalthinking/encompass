var Seeder = require('mongoose-data-seed').Seeder;
var Folder = require('../server/datasource/schemas').Folder;

var data = [{

}];

var FoldersSeeder = Seeder.extend({
  shouldRun: function () {
    return Folder.count().exec().then(count => count === 0);
  },
  run: function () {
    return Folder.create(data);
  }
});

module.exports = FoldersSeeder;
