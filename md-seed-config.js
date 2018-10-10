/*
 * This is main file for seeding encompass_seed
 * Commands:
    * md-seed run - this populates db from seed files
    * md-seed run --dropdb - this resets and populates db
    * md-seed g users - this is how you create an individual seed file
 */

var mongooseLib = require('mongoose');

var Users = require('./seeders/users.seeder');
var Sections = require('./seeders/sections.seeder');
var Answers = require('./seeders/answers.seeder');
var Comments = require('./seeders/comments.seeder');
var Folders = require('./seeders/folders.seeder');
//var Pdsubmissions = require('./seeders/pdsubmissions.seeder');
var Problems = require('./seeders/problems.seeder');
var Responses = require('./seeders/responses.seeder');
var Selections = require('./seeders/selections.seeder');
var Submissions = require('./seeders/submissions.seeder');
var Taggings = require('./seeders/taggings.seeder');
var Workspaces = require('./seeders/workspaces.seeder');
var Organizations = require('./seeders/organizations.seeder');
var Categories = require('./seeders/categories.seeder');
var Assignments = require('./seeders/assignments.seeder');
var EncWorkspaceRequests = require('./seeders/encworkspacerequests.seeder');
var Images = require('./seeders/images.seeder');

// to be able to read the .env file
require('dotenv').config();

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
    Organizations,
    Problems,
    Responses,
    Selections,
    Workspaces,
    Folders,
    Submissions,
    // Pdsubmissions,
    Taggings,
    Comments,
    Categories,
    Assignments,
    EncWorkspaceRequests,
    Images
  }
};
