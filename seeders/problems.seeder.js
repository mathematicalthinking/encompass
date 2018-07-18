var Seeder = require('mongoose-data-seed').Seeder;
var Problem = require('../server/datasource/schemas').Problem;

var data = [{

}];

var ProblemsSeeder = Seeder.extend({
  shouldRun: function () {
    return Problem.count().exec().then(count => count === 0);
  },
  run: function () {
    return Problem.create(data);
  }
});

module.exports = ProblemsSeeder;
