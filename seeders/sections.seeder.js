var Seeder = require('mongoose-data-seed').Seeder;
var Section = require('../server/datasource/schemas').Section;

var data = [{

}];

var SectionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Section.count().exec().then(count => count === 0);
  },
  run: function () {
    return Section.create(data);
  }
});

module.exports = SectionsSeeder;
