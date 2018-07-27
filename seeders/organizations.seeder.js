var Seeder = require('mongoose-data-seed').Seeder
var Organization = require('../server/datasource/schemas').Organization

var data = [
  {
    '_id': '5b4a64a028e4b75919c28512',
    'name': 'Drexel University'
  }, {
    '_id': '5b4e4b48808c7eebc9f9e827',
    'name': 'Temple University'
  }, {
    '_id': '5b4e4d5f808c7eebc9f9e82c',
    'name': 'Mathematical Thinking'
  }
]

var OrganizationsSeeder = Seeder.extend({
  shouldRun: function () {
    return Organization.count().exec().then(count => count === 0)
  },
  run: function () {
    return Organization.create(data)
  }
})

module.exports = OrganizationsSeeder
