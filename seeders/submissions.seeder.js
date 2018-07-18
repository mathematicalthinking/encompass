var Seeder = require('mongoose-data-seed').Seeder;
var Submissions = require('../server/datasource/schemas').Submissions;

var data = [{

}];

var SubmissionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Submissions.count().exec().then(count => count === 0);
  },
  run: function () {
    return Submissions.create(data);
  }
});

module.exports = SubmissionsSeeder;
