var Seeder = require('mongoose-data-seed').Seeder;
var Pdsubmission = require('../server/datasource/schemas').Pdsubmission;

var Model = require('../server/models');

var data = [{

}];

var PdsubmissionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Pdsubmission.count().exec().then(count => count === 0);
  },
  run: function () {
    return Pdsubmission.create(data);
  }
});

module.exports = PdsubmissionsSeeder;
