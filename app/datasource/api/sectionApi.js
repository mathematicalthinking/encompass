/**
  * # Section API
  * @description This is the API for section based requests
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
  * @method getSections
  * @description __URL__: /api/sections
  * @returns {Object} An array of section objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getSections = (req, res, next) => {
  const criteria = utils.buildCriteria(req);
  const user = auth.requireUser(req);
  models.Section.find(criteria)
  .exec((err, sections) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'sections': sections};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method getSection
  * @description __URL__: /api/section/:id
  * @returns {Object} An section object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getSection = (req, res, next) => {
  models.Section.findById(req.params.id)
  .exec((err, section) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'section': section};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postSection
  * @description __URL__: /api/sections
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

const postSection = (req, res, next) => {
  const user = auth.requireUser(req);
  // do we want to check if the user is allows to create sections?
  const section = new models.Section(req.body.section);
  section.createdBy = user;
  section.createdDate = Date.now();
  section.save((err, doc) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'section': doc};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method putSection
  * @description __URL__: /api/sections/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const putSection = (req, res, next) => {
  const user = auth.requireUser(req);
  // what check do we want to perform if the user can edit
  // if they created the section?
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    // make the updates
    for(var field in req.body.section) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.section[field];
      }
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.sections = getSections;
module.exports.get.section = getSection;
module.exports.post.section = postSection;
module.exports.put.section = putSection;
