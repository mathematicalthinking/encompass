/**
  * # Category API
  * @description This is the API for category based requests
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
  * @method getCategories
  * @description __URL__: /api/categories
  * @returns {Object} An array of category objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getCategories = (req, res, next) => {
  const criteria = utils.buildCriteria(req);
  const user = auth.requireUser(req);
  models.Category.find(criteria)
  .exec((err, categories) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'categories': categories};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method getCategory
  * @description __URL__: /api/category/:id
  * @returns {Object} An category object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getCategory = (req, res, next) => {
  models.Category.findById(req.params.id)
  .exec((err, category) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'category': category};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postCategory
  * @description __URL__: /api/categories
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

const postCategory = (req, res, next) => {
  const user = auth.requireUser(req);
  // who can create categories - add permission here
  const category = new models.Category(req.body.category);
  category.createdBy = user;
  category.createdDate = Date.now();
  category.save((err, doc) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'category': doc};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method putCategory
  * @description __URL__: /api/categories/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const putCategory = (req, res, next) => {
  const user = auth.requireUser(req);
  // Who can edit the category?
  models.Category.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    // make the updates
    for(var field in req.body.category) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.category[field];
      }
    }
    doc.save((err, category) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
      }
      const data = {'category': category};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.categories = getCategories;
module.exports.get.category = getCategory;
module.exports.post.category = postCategory;
module.exports.put.category = putCategory;
