var mongooseLib = require('mongoose');

var Users = require('./seeders/users.seeder');
// var Sections = require('./seeders/sections.seeder');

mongooseLib.Promise = global.Promise || Promise;

module.exports = {

  // Export the mongoose lib
  mongoose: mongooseLib,

  // Export the mongodb url
  mongoURL: process.env.MONGO_URL || 'mongodb://localhost:27017/encompass_seed',

  /*
    Seeders List
    ------
    order is important
  */
  seedersList: {
    Users,
    // Sections,
  }
};
