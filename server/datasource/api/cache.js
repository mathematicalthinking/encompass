/**
  * # The Cache
  * @description Cache is responsible for saving submission data from an external source to the database
  *              This source may be a url or a file.
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  * @todo Do we need this, we are no longer getting submissions from an external source
  */

//REQUIRE MODULES
const mongoose = require('mongoose');
const _ = require('underscore');
const fs = require('fs');
const request = require('request');
const qs = require('querystring');
const Q = require('q');

//REQUIRE FILES
const api = require('./submissionApi');
const db = require('../../config').nconf.get('database');
//const config = require('../../config').nconf.get('cache');
const utils = require('../../middleware/requestHandler');

/*
 * @description Regex for url
 */
var isUrl = /^http/;

/*
 * @description Promise returning readFile
 */
var readFile = Q.denodeify(fs.readFile);

/*
 * @description Promise returning HTTP request
 */
var readUrl = Q.denodeify(request);

/*
 * @description Connect to the database
 */
function connect() {
  if (mongoose.connection.readyState !== mongoose.Connection.STATES.connected) {
    var opts = { user: db.user, pass: db.pass };
    mongoose.connect(db.host, db.name, db.port, opts);
    mongoose.connection.on('error', console.error.bind(console, 'connection error'));
  }
}

/*eslint no-nested-ternary: "off"*/

/*
 *  @description Count duplicates in submissions
 */
function duplicates(submissions) {
  var count = submissions.length;
  var dups = [];

  submissions.sort(function (a, b) {
    return (a.powId > b.powId) ? 1 : ((a.powId < b.powId) ? -1 : 0);
  });

  for (var i = 0; i < count - 1; i++) {
    if (submissions[i + 1].powId === submissions[i].powId) {
      dups.push(submissions[i].powId);
    }
  }

  return dups;
}


/*
 *  @description Convert options to a queryString
 */
function toQueryString(options, allowed) {
  var query = {};

  for (var key in options) {
    if (_.contains(allowed, key)) {
      var alias = key;

      switch (key) {
        case 'teacher':
          alias = 'teacher_username';
          break;
        case 'publication':
          alias = 'publication_id';
          break;
        case 'puzzle':
          alias = 'puzzle_id';
          break;
        case 'submissions':
          alias = 'id';
          break;
        case 'submitter':
          alias = 'creator_username';
          break;
        default:
          alias = key;
      }

      query[alias] = options[key];
    }
  }

  if (query.id) { //Ignore all other options if submission ids are given
    query = { id: query.id };
  }

  return qs.stringify(query);
}

/**
  * @public
  * @method cache
  * @description Cache Saves submission data to the database according to `options`
  * @param {Object} options An options object
  * @return {Object} A status object
  * @howto The options object must have the following fields:
  *         + user {String} (optional)
  *         + class_id {Int} (optional)
  *         + collection {String} (optional)
  *         + teacher {String} --------
  *         + publication {Int}        |
  *         + puzzle {Int}             | - One or more of these 5 are required
  *         + submitter {String}       |
  *         + submissions {Int/Array} _|
  *         + since_date {Int} (optional) -
  *         + max_date {Int} (optional)    |
  *         + since_id {Int} (optional)    | - These 4 can be used in place of submissions if submissions is an empty array
  *         + max_id {Int} (optional) -----
  *         + source (optional file or url path)
  *           - file source paths only use user and/or collection
  *        The returned object will contain the following fields:
  *         + success (bool - did import succeed?)
  *         + importer (same as user or teacher if user not provided)
  *         + imported (number of imported submissions)
  *         + duplicates (number of duplicates present)
  */
function cache(options) {

  if (options.teacher && !options.user) {
    options.user = options.teacher;
  }

  var allowed = [
    //    'user',
    'teacher',
    'submitter',
    //    'collection',
    'publication',
    'puzzle',
    'class_id',
    'submissions',
    'since_date',
    'max_date',
    'since_id',
    'max_id',
  ];

  var required = [
    options.teacher,
    options.submitter,
    options.publication,
    options.puzzle,
    options.submissions,
  ];

  var report = {
    success: false,
    importer: options.user,
    imported: 0,
    updatedExisting: 0,
    addedNew: 0,
    duplicates: 0,
    detail: {}
  };

  var result = Q.defer();

  var hasRequiredUrlOptions = _.any(required);
  var hasRequiredFileOptions = _.any([options.user, options.teacher, options.collection]);

  /**
    * @description This callback runs toSubmission on a JSON array
    * @see [toSubmission](./api/submissionApi)
    */

  var processJSON = function (json) {
    try {
      //    logger.debug(json[0]); // Useful for checking the format of the json

      if (options.collection) {
        json.forEach(api.toPDSubmission);
      } else {
        json.forEach(api.toSubmission);
      }
    }
    catch (e) {
      e.info = "Invalid JSON: Could not convert to submission";
      return Q.reject(e);
    }

    report.imported = json.length;
    report.duplicates = duplicates(json).length;

    return new Q(json);
  };

/*eslint no-eval: "off"*/

  /**
    * @description This callback handles the response of an HTTP request
    */
  var processResponse = function (response) {
    var body = response[1];
    var json;
    var error;

    // We should be using JSON.parse here, but it currently fails (maybe PoW JSON needs some escaping?)
    if (_.isArray(body)) {
      try {
        json = eval(body);
      }
      catch (e) {
        e.info = "Invalid JSON: Could not parse to response";
        return Q.reject(e);
      }

      return new Q(json);
    }
    else {
      error = new Error('Invalid Data Received!');
      error.name = 'Response Error';

      return Q.reject(error);
    }
  };

  var save = function (data) {
    connect();

    var total = data.length;

    if (total > 0) {
      data.forEach(function (obj) {
        var Model = obj.constructor;
        var upsertData = obj.toObject();
        var query = { powId: obj.powId };

        /* ENC-433, ENC-475, ENC-477, ENC-508
         * Keep existing Encompass relationships & properties when caching submissions
         */
        delete upsertData._id;
        delete upsertData.workspaces;
        delete upsertData.selections;
        delete upsertData.comments;
        delete upsertData.responses;
        delete upsertData.isTrashed;

        if (options.collection) {
          upsertData.pdSet = options.collection;
        }

        if (options.user) {
          upsertData.teacher = { username: options.user };
          query["teacher.username"] = options.user;
        }


        Model.update(query, upsertData, { upsert: true }, function (err, affected) {
          if (err) {
            err.info = "Save Failed: Unable to cache data";
            return Q.reject(err);
          }
          if (affected.nModified) {
            report.updatedExisting += 1;
          } else {
            report.addedNew += 1;
          }

          total--;
          if (total === 0) {
            report.success = true;
            result.resolve(report);
          }
        });
      });
    }
    else {
      report.success = true;
      result.resolve(report);
    }
  };

  var logError = function (err) {
    report.error = err;
    result.reject(report.error);
  };

  if (!options.source && !hasRequiredUrlOptions) {
    report.error = new Error('Required arguments not provided');
    report.error.name = 'Missing Arguments';

    result.reject(report.error);
    return result.promise;
  }

  if (options.source && !isUrl.test(options.source)) {
    if (!hasRequiredFileOptions) {
      report.error = new Error('Required arguments not provided');
      report.error.name = 'Missing Arguments';

      result.reject(report.error);
      return result.promise;
    }

    readFile(options.source, 'utf8')
      .then(JSON.parse)
      .then(processJSON)
      .done(save, logError);

    return new Q(result.promise);
  }

  if (hasRequiredUrlOptions) {
    var key = utils.generateApiKey(Date.now());
    var query = toQueryString(options, allowed);
    var restEndpoint = (options.submissions) ? process.env.CACHE_GETURL : process.env.CACHE_SEARCHURL;

    var params = {
      uri: restEndpoint.concat("?", query),
      json: true,
      followRedirect: false,
      method: 'GET',
      headers: key
    };

    readUrl(params)
      .then(processResponse)
      .then(processJSON)
      .done(save, logError);

    return new Q(result.promise);
  }
}

//cache({user: 'user_test', puzzle: 973})
//.then(console.log, console.log);

module.exports = cache.bind(this); //return a new function (may not be necessary)
