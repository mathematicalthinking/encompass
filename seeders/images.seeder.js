var Seeder = require('mongoose-data-seed').Seeder;
var Image = require('../server/datasource/schemas').Image;

var data = [
  {
    "_id" : "5bbe0359ecd6e597fd8f6a28",
    "isTrashed" : true,
    "createdBy": "5b4e4b48808c7eebc9f9e827"
}
];

var ImagesSeeder = Seeder.extend({
  shouldRun: function () {
    return Image.count().exec().then(count => count === 0);
  },
  run: function () {
    return Image.create(data);
  }
});

module.exports = ImagesSeeder;