var Seeder = require('mongoose-data-seed').Seeder;
var User = require('../server/datasource/schemas').User;

var data = [{
  _id: "52a88ae2729e9ef59ba7eb4b",
  username: 'phil',
  email: 'test',
}];

var UsersSeeder = Seeder.extend({
  shouldRun: function () {
    return User.count().exec().then(count => count === 0);
  },
  run: function () {
    return User.create(data);
  }
});

module.exports = UsersSeeder;
