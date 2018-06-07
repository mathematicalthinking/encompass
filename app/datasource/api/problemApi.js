/**
  * # Problem API
  * @description This is the API for problem based requests
*/

var mongoose = require('mongoose'),
  express = require('express'),
  _ = require('underscore'),
  logger = require('log4js').getLogger('server'),
  models = require('../schemas'),
  auth = require('./auth'),
  permissions  = require('../../../common/permissions'),
  utils    = require('./requestHandler');

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
  // add permissions here
  models.Problem.find(criteria)
  .exec((err, problems) => {
    if (err) {
      logger.error(err);
      utils.sendError(new err.InternalError(err.message), res);
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
  const user = auth.requireUser(req);
  // add permissions here
  models.Problem.findById(req.params.id)
  .exec((err, problem) => {
    if (err) {
      logger.error(err);
      utils.sendError(new err.InternalError(err.message), res);
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
  // Add permission checks here
  const problem = new models.Problem(req.body.problem);
  problem.createdBy = user;
  problem.createdDate = Date.now();
  problem.save((err, doc) => {
    if (err) {
      logger.error(err);
      utils.sendError(new err.InternalError(err.message), res);
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
  * @description cannot make changes to the categories with putProblem
  *              use addCategory or removeCategory
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const putProblem = (req, res, next) => {
  const user = auth.requireUser(req);
  // Add permission checks here
  models.Problem.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new err.InternalError(err.message), res);
    }
    // make the updates, but don't update categories or _id
    for(let field in req.body.problem) {
      if((field !== '_id') && (field !== undefined) && (field !== 'categories')) {
        doc[field] = req.body.problem[field];
      }
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        utils.sendError(new err.InternalError(err.message), res);
      }
      const data = {'problem': problem};
      utils.sendResponse(res, data);
    });
  });
};

/**
  * @public
  * @method addCategory
  * @description __URL__: /api/problems/addCategory/:id
  * @body {categoryId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const addCategory = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Problem.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new err.InternalError(err.message), res);
      return;
    }
    // only add a category if it's new
    if (doc.categories.indexOf(req.body.categoryId) === -1){
      // doing a simple arr.push(id) was throwing an error because it was
      // invoking mongoose's deprectated $pushAll method. Using the
      // concat() method below uses $set and thus works.
      doc.categories = doc.categories.concat([req.body.categoryId]);
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        utils.sendError(new err.InternalError(err.message), res);
        return;
      }
      const data = {'problem': problem};
      utils.sendResponse(res, data);
    });
  });
};

/**
  * @public
  * @method removeCategory
  * @description __URL__: /api/problems/removeCategory/:id
  * @body {categoryId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const removeCategory = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Problem.findById(req.params.id, (err, doc) => {
    if (err) {
      logger.error(err);
      utils.sendError(new err.InternalError(err.message), res);
    }
    // only attempt to remove if the category exists
    if (doc.categories.indexOf(req.body.categoryId) !== -1) {
      // remove category using the category Id
      doc.categories.splice(doc.categories.indexOf(req.body.categoryId), 1);
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        utils.SendError(new err.InternalError(err.message), res);
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
module.exports.put.problem.addCategory = addCategory;
module.exports.put.problem.removeCategory = removeCategory;
