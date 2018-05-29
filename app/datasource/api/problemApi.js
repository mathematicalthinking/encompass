/**
  * # Problem API
  * @description This is the API for problem based requests
  * @author Michael McVeigh
*/

var mongoose = require('mongoose'),
  restify = require('restify'),
  _ = require('underscore'),
  logger = require('log4js').getLogger('server'),
  models = require('../schemas'),
  auth = require('./auth'),
  permissions  = require('../../../common/permissions'),
  utils    = require('./requestHandler'),
  errors = require('restify-errors');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getProblems
  * @description __URL__: /api/problems
  * @returns {Object} An array of problem objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getProblems = (req, res, next) => {
  const criteria = utils.buildCriteria(req);
  const user = auth.requireUser(req);
  models.Problem.find(criteria)
  .exec((err, problems) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'problems': problems};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method getProblem
  * @description __URL__: /api/problem/:id
  * @returns {Object} An problem object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getProblem = (req, res, next) => {
  models.Problem.findById(req.params.id)
  .exec((err, problem) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'problem': problem};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postProblem
  * @description __URL__: /api/problems
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

const postProblem = (req, res, next) => {
  const user = auth.requireUser(req);
  // do we want to check if the user is allows to create problems?
  const problem = new models.Problem(req.body.problem);
  problem.createdBy = user;
  problem.createdDate = Date.now();
  problem.save((err, doc) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'problem': doc};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method putProblem
  * @description __URL__: /api/problems/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const putProblem = (req, res, next) => {
  const user = auth.requireUser(req);
  // what check do we want to perform if the user can edit
  // if they created the problem?
  models.Problem.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    // make the updates
    for(var field in req.body.problem) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.problem[field];
      }
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
      }
      const data = {'problem': problem};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.problems = getProblems;
module.exports.get.problem = getProblem;
module.exports.post.problem = postProblem;
module.exports.put.problem = putProblem;
