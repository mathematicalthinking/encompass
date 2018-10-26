/**
  * # Category API
  * @description This is the API for category based requests
  * @author Michael McVeigh
*/

//REQUIRE MODULES
const logger = require('log4js').getLogger('server');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const categories = require('../categories.json');


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

  if (req.query.ids) {
    const criteria = utils.buildCriteria(req);
    models.Category.find(criteria)
    .exec((err, categories) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'categories': categories};
      return utils.sendResponse(res, data);
    });
  } else if (req.query.identifier) {
    models.Category.find({ identifier: {$eq: req.query.identifier }})
      .exec((err, categories) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        const data = {'categories': categories};
        return utils.sendResponse(res, data);
      });
  } else if (req.query.searchBy) {
    let { identifier } = req.query.searchBy;
    let group = `.*(${identifier}).*`;
    let regex = new RegExp(group, 'i');

    models.Category.find({ identifier: regex})
      .exec((err, categories) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        const data = {'categories': categories};
        return utils.sendResponse(res, data);
      });
  } else {
    let data = {
      categories: [],
      meta: {
        categories: categories
      }
    };
    return utils.sendResponse(res, data);
  }
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
      return utils.sendError.InternalError(err, res);
    }
    if (!category || category.isTrashed) {
      return utils.sendResponse(res, null);
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
  const user = userAuth.requireUser(req);
  // who can create categories - add permission here
  const category = new models.Category(req.body.category);
  category.createdBy = user;
  category.createDate = Date.now();
  category.save((err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  // Who can edit the category?
  models.Category.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
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
        return utils.sendError.InternalError(err, res);
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
