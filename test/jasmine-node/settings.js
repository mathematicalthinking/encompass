/**
  * # Common Test Properties
  * @description These are our settings for every REST API test
  * @authors Damola Mabogunje <damola@mathforum.org>
  * @todo Add taggings and workspace url to tests
  * @since 1.0.1
  */

var fs    = require('fs');
var Q     = require('q');

//Settings
var timeout = 1000;
var transaction = 5000;
var remoteConfigFile = 'config.json';
var fileFormat = 'utf-8';

var read = Q.denodeify(fs.readFile);

var useRemote = function(text) {
  var remote = JSON.parse(text);
  var config = {
    host: remote.test.host,
    database: remote.test.db,
  };

  return config;
};

var useLocal = function(err) {
  console.warn('could not read remote config: ', err);
  console.info('using local settings');

  var local = require('../../server/config.js');
  var db = local.nconf.get('database');
  var config  = {
    host: ['http://localhost:',
      local.nconf.get('port'),
      '/api'
    ].join(''),
    database: ['mongodb://',
      db.user,
      (db.pass) ? ':' + db.pass : '',
      '@',
      db.host,
      ':',
      db.port,
      '/',
      db.name
    ].join(''),
  };

  return config;
};

var settings = read(remoteConfigFile, fileFormat)
  .then(useRemote, useLocal)
  .then(function(config) { //Add global settings
    config.timeout = 1000;
    config.transaction = 5000;

    return config;
  });


module.exports = settings;
