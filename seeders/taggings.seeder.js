var Seeder = require('mongoose-data-seed').Seeder;
var Tagging = require('../server/datasource/schemas').Tagging;

var data = [{

}];

var TaggingsSeeder = Seeder.extend({
  shouldRun: function () {
    return Tagging.count().exec().then(count => count === 0);
  },
  run: function () {
    return Tagging.create(data);
  }
});

module.exports = TaggingsSeeder;
