var Seeder = require('mongoose-data-seed').Seeder;
var Selection = require('../server/datasource/schemas').Selection;

var data = [{

}];

var SelectionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Selection.count().exec().then(count => count === 0);
  },
  run: function () {
    return Selection.create(data);
  }
});

module.exports = SelectionsSeeder;
