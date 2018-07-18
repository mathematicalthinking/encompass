var Seeder = require('mongoose-data-seed').Seeder;
var User = require('../server/datasource/schemas').User;

var data = [{
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