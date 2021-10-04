/* jshint ignore:start */
/**
  * # Submissions API
  * @description This is the API for submission based requests
  * @author Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
//REQUIRE MODULES

const mongoose = require('mongoose');
const _ = require('underscore');
const logger   = require('log4js').getLogger('server');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const spaces   = require('./workspaceApi');
const access   = require('../../middleware/access/submissions');
const responseAccess = require('../../middleware/access/responses');

const { areObjectIdsEqual } = require('../../utils/mongoose');
const { isNonEmptyArray, } = require('../../utils/objects');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @callback toSubmission
  * @description This is a callback to be used with forEach on an array of PoW submissions
  *              It converts all the JSON objects into Mongoose submission models in place.
  * @see [modelize] (../../middleware/requestHandler.html)
  * @param  {Object}  obj   The current element in the array being iterated through
  * @param  {Number}  index The array index of obj
  * @param  {Array}   arr   The array being iterated though
  * @example
  *     1. array.forEach(toSubmission);
 */

function toSubmission(obj, index, arr) {
  if ( !_.isUndefined(obj) ) {
    var model = new models.Submission(),
        json = utils.modelize(obj, '');

    /* When preloading submissions from a file, the obj already has a powId,
       however when loading RESTfully, the field is called `id`, which modelize
       converts to `Id` as a side-effect. So we take care of that here
    */
    json.powId = (obj.powId) ? obj.powId : json.Id;
    delete json.Id;

    for (var property in json) {
      if( json.hasOwnProperty(property) ) {
        model.set(property, json[property]);
      }
    }

    arr[index] = model; // Modifying array in-place
  }
}

/**
  * @public
  * @callback toPDSubmission
  * @description Same as `toSubmission` but converts to PDSubmissions
  * @see [modelize] (../../middleware/requestHandler.html)
  * @see [toSubmission] (./submissionApi.js)
  * @param  {Object}  obj   The current element in the array being iterated through
  * @param  {Number}  index The array index of obj
  * @param  {Array}   arr   The array being iterated though
  * @example
  *     1. array.forEach(toPDSubmission);
 */
function toPDSubmission(obj, index, arr) {
  if ( !_.isUndefined(obj) ) {
    var model = new models.PDSubmission(),
        json = utils.modelize(obj, '');

    /* When preloading submissions from a file, the obj already has a powId,
       however when loading RESTfully, the field is called `id`, which modelize
       converts to `Id` as a side-effect. So we take care of that here
    */
    json.powId = (obj.powId) ? obj.powId : json.Id;
    delete json.Id;

    for (var property in json) {
      if( json.hasOwnProperty(property) ) {
        model.set(property, json[property]);
      }
    }
    arr[index] = model; // Modifying array in-place
  }
}

/**
  * @public
  * @method getSubmissions
  * @description __URL__: /api/submissions
  * @see [buildCriteria](../../middleware/requestHandler.html)
  * @returns {Object} A 'named' array of submission objects: according to specified criteria
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
async function getSubmissions(req, res, next) {
  let user = userAuth.getUser(req);
  try {

    let isAdmin = user.accountType === 'A' && user.actingRole !== 'student';

    let doFilterResponses = !isAdmin;

    let criteriaPromises = [ access.get.submissions(user, req.query.ids, req.query.filterBy) ];

    if (doFilterResponses) {
      criteriaPromises.push(responseAccess.get.responses(user, null, null, { submissions: req.query.ids }));
    }
  let [ submissionCriteria, responseCriteria ] = await Promise.all(criteriaPromises);

  let recordPromises = [ models.Submission.find(submissionCriteria).lean().exec() ];

  if (responseCriteria) {
    recordPromises.push(models.Response.find(responseCriteria, {_id: 1}).lean().exec());
  }

  let [ submissions, responses ] = await Promise.all(recordPromises);

  if (doFilterResponses) {
    submissions.forEach((submission) => {
      let base = submission.responses || [];
      submission.responses = base.filter((response) => {
        return _.find(responses, (responseObj) => {
          return areObjectIdsEqual(responseObj._id, response);
        });
      });
    });
  }

  let data = { submissions };
  logger.debug('Get Submissions found: ' + submissions.length );
  return utils.sendResponse(res, data);

  }catch(err) {
    console.error('caught error getSubmissions', err);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }

}

/**
  * @public
  * @method getLatestUserSubmission
  * @description Retrieves the most recent submission for user
  *              with `username`
  */
function getLatestUserSubmission (username, callback) { // eslint-disable-line no-unused-vars

  mongoose.connection.once('open', function() {
    models.Submission.find({'teacher.username': username})
      .sort( {'createDate': -1} )
      .limit(1)
      .lean()
      .exec(function (err, docs) {
        if (err) { return callback(err); }
        callback(null, docs.pop());
      });
  });
}

/**
  * @public
  * @method getPDSets
  * @description __URL__: /api/PDSets
  * @see [aggregate](http://mongoosejs.com/docs/api.html#aggregate_Aggregate)
  * @returns {Object} A 'named' array of submission objects: according to specified criteria
  * @todo Needs to throw/return errors if any
  * @howto Because a pdSet is defined by a nested property on a submission as opposed to
           being an actual object containing submissions, here we create the PDset objects
           by aggregating and projecting the nested properties of submissions.

           *Notes on aggregate*:
           + $group defines the grouping key and other stats we want to keep track off
           + $project does field renaming to allow use nested properties at the top level
           + The `$` strings refer to nested properties of submission objects
  */
function getPDSets(req, res, next) {
  let user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
  }
  // let { accountType, actingRole } = user;
  // if (accountType === 'S' || actingRole === 'student') {
  //   return utils.sendError.NotAuthorizedError('You do not have permission.', res);
  // }

  models.PDSubmission.aggregate(
    {
      $group: {
        _id: {
          group: "$pdSet",
        },
        submissions: { $addToSet: "$_id" },
        count: { $sum: 1 }
      }
    },{
      $project: {
        _id: "$_id.group",
        submissions: "$submissions",
        count: "$count"
      }
    },
    function(err, results){
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      utils.sendResponse(res, {PdSet: results});
    });
}

/**
  * @public
  * @method getSubmission
  * @description __URL__: /api/submissions/:id
  * @returns {Object} A 'named' submission object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
async function getSubmission(req, res, next) {
  try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
    }

    let isAdmin = user.accountType === 'A' && user.actingRole !== 'student';

    let doFilterResponses = !isAdmin;


    let canLoadSubmission;
    let submission;

    let id = req.params.id;

    submission = await models.Submission.findById(id).lean().exec();

    if (!submission || submission.isTrashed) { // record not found in db
      return utils.sendResponse(res, null);
    }

    canLoadSubmission = await access.get.submission(user, id);

    if (!canLoadSubmission) { // user does not have permission to access submission
      return utils.sendError.NotAuthorizedError('You do not have permission.', res);
    }

    // filter responses

    if (doFilterResponses) {
      let responseIds = submission.responses;
      let responseCriteria;

      if (isNonEmptyArray(responseIds)) {
        responseCriteria = await responseAccess.get.responses(user, responseIds);
        let responses = await models.Response.find(responseCriteria, { _id: 1 }).lean().exec();

        submission.responses = submission.responses.filter((response) => {
          return _.find(responses, (responseObj) => {
            return areObjectIdsEqual(responseObj._id, response);
          });
        });
      }
    }

    const data = { // user has permission; send back record
      submission
    };

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getSubmission: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);

  }
}


/**
  * @public
  * @method postSubmission
  * @description __URL__: /api/submissions
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data save failed
  * @throws {RestError} Something? went wrong
  */
function postSubmission(req, res, next) {
  var isAnonymousPost = (!!req.headers.secret && !!req.headers.time); // Note: We assume the header if present, is correctly formatted
  var postData = req.body;
  delete postData._id;


  var user = userAuth.getUser(req); //user isn't required
  if(user.isAuthorized || isAnonymousPost) {
    var access = utils.isValidApiKey(req.headers.secret, req.headers.time) || user.isAuthorized;

    if (access) {
      try {
        var submissions = [postData];
        submissions.forEach(toPDSubmission);
        for(var item in submissions) {
          if(item) {
            var submission = submissions[item];
            submission.pdSet = 'system';
          }
        }
        models.PDSubmission.create(submissions, function(err, data) {
          if(err) { throw err; }
          return utils.sendResponse(res, {submission: data});
        });
      }
      catch (error) {
        return utils.sendError.InternalError(error, res);
      }
    }
  } else {
    return utils.sendError.NotAuthorizedError('You do not have permissions to do this', res);
  }
}

/**
  * @public
  * @method putSubmission
  * @description __URL__: /api/submissions
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function putSubmission(req, res, next) {

  models.Submission.findById(req.params.id, function (err, doc) {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

    for(var field in req.body.submission) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.submission[field];
      }
    }

    doc.save(function (err, submission) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      var data = {'submission': submission};
      utils.sendResponse(res, data);
    });
  });
}

/**
  * @public
  * @method importSubmissions
  * @description __URL__: /api/importRequest
  *              This method runs the cache with user specified arguments
  *              for an authorized user.
  * @see [cache.js](../cache.js)
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */
function importSubmissions(req, res, next) {
  var user = userAuth.requireUser(req);
  var importId = mongoose.Types.ObjectId();
  var params = JSON.parse( JSON.stringify(req.body.importRequest) );

  // Sterilizing request params (not very well - at the moment we're just dropping empty fields)
  for (var field in params) {
    if(!params[field] || ( _.isArray(params[field]) && _.isEmpty(params[field]) )) {
      delete params[field];
    }
  }

  var options = _.object( _.pairs(params) );
  options.user = user.username; // Add the cache user option with the logged in user
  delete options.folders; // Remove the folders option since cache doesn't use it

  logger.debug(params, options);

  // Create Workspace Request
  var requestWorkspaces = function(report) {
    req.body.importRequest._id = importId; // Assign a fake ID
    req.body.importRequest.results = report;

    req.body.newWorkspaceRequest = {
      folderSetName: params.folders,
      pdSetName: 'default',
    };
  };

  var buildWorkspaces = spaces.post.newWorkspaceRequest.bind(this, req, res, next);
  var finish = next.bind(this, false);

  var onReject = function(error) {
    logger.debug(error);
    return utils.sendError.RestError(error, res);
  };

  /*
   * `require` works around not being able to import
   * after auto-import on login. Otherwise value of cache
   * is the result of last import
  */
  require('./cache')(options)
    .then(requestWorkspaces)
    .then(buildWorkspaces)
    .done(finish, onReject);
}

module.exports.toSubmission = toSubmission;
module.exports.toPDSubmission = toPDSubmission;
module.exports.get.pdSets = getPDSets;
module.exports.get.submissions = getSubmissions;
module.exports.get.submission = getSubmission;
module.exports.post.submission = postSubmission;
module.exports.put.submission = putSubmission;
module.exports.post.importSubmissionsRequest = importSubmissions;
/* jshint ignore:end */