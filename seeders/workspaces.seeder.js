var Seeder = require('mongoose-data-seed').Seeder;
var Workspace = require('../server/datasource/schemas').Workspace;


var data = [{

}];

var WorkspacesSeeder = Seeder.extend({
  shouldRun: function () {
    return Workspace.count().exec().then(count => count === 0);
  },
  run: function () {
    return Workspace.create(data);
  }
});

module.exports = WorkspacesSeeder;
