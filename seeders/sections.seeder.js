var Seeder = require('mongoose-data-seed').Seeder;
var Section = require('../server/datasource/schemas').Section;

var data = [{
  "_id": "5b1e7b2aa5d2157ef4c91108",
  "sectionId": 26916,
  "name": "Drexel University",
  "problems": ["5b1e7a0ba5d2157ef4c91028"],
  "students": ["5b368afdca1375a94fabde39"],
  "teachers": ["5b1e7bf9a5d2157ef4c911a6"],
  "assignments": [],
  "organization": "5b4e4d5f808c7eebc9f9e82c",
  "isTrashed": false,
  "createdBy": "5b245760ac75842be3189525",
}];


var SectionsSeeder = Seeder.extend({
  shouldRun: function () {
    return Section.count().exec().then(count => count === 0);
  },
  run: function () {
    return Section.create(data);
  }
});

module.exports = SectionsSeeder;
