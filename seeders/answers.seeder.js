var Seeder = require('mongoose-data-seed').Seeder;
var Answer = require('../server/datasource/schemas').Answer;

var data = [{

}];

var AnswersSeeder = Seeder.extend({
  shouldRun: function () {
    return Answer.count().exec().then(count => count === 0);
  },
  run: function () {
    return Answer.create(data);
  }
});

module.exports = AnswersSeeder;