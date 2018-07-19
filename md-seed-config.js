/*
 * This is main file for seeding our seedDB
 * Commands:
    * md-seed run - this populates db from seed files
    * md-seed run --dropdb - this resets the db
    * md-seed g users - this is how you create a seed file
 */

var mongooseLib = require('mongoose');

var Users = require('./seeders/users.seeder');
var Sections = require('./seeders/sections.seeder');
var Answers = require('./seeders/answers.seeder');
// var Comments = require('./seeders/comments.seeder');
// var Folders = require('./seeders/folders.seeder');
// var Pdsubmissions = require('./seeders/pdsubmissions.seeder');
var Problems = require('./seeders/problems.seeder');
var Responses = require('./seeders/responses.seeder');
var Selections = require('./seeders/selections.seeder');
// var Submissions = require('./seeders/submissions.seeder');
// var Taggings = require('./seeders/taggings.seeder');
var Workspaces = require('./seeders/workspaces.seeder');

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
    Sections,
    Answers,
    Problems,
    Responses,
    Selections,
    // Folders,
    // Pdsubmissions,
    Workspaces,
    // Submissions,
    // Taggings,
    // Comments,
  }
};
