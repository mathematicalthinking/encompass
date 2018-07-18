var Seeder = require('mongoose-data-seed').Seeder;
var Response = require('../server/datasource/schemas').Response;

var data = [{

}];

var ResponsesSeeder = Seeder.extend({
  shouldRun: function () {
    return Response.count().exec().then(count => count === 0);
  },
  run: function () {
    return Response.create(data);
  }
});

module.exports = ResponsesSeeder;
