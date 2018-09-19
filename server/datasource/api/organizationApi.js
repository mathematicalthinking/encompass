/**
  * # Organization API
  * @description This is the API for organization based requests
  * @author Daniel Kelly
*/
/* jshint ignore:start */

var mongoose = require('mongoose'),
  express = require('express'),
  _ = require('underscore'),
  logger = require('log4js').getLogger('server'),
  models = require('../schemas'),
  auth = require('./auth'),
  userAuth = require('../../middleware/userAuth'),
  permissions = require('../../../common/permissions'),
  utils = require('../../middleware/requestHandler');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getOrganizations
  * @description __URL__: /api/organizations
  * @returns {Object} An array of organization objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
*/

const getOrganizations = async function(req, res, next) {
  //const criteria = utils.buildCriteria(req);
  //const user = userAuth.requireUser(req);
  try {
    const sortBy = req.query.sortBy;
    let organizations = await models.Organization.find({});


    if (sortBy === 'members') {
      // return orgs sorted by member count descending
      let tuples = await Promise.all(organizations.map((org) => {
        return org.getMemberCount(org._id).then((count) => {
          return [org, count];
        });
      }));

      let sorted = tuples.sort((a, b) => {
        return b[1] - a[1];
      });
      organizations = sorted.map(t => t[0]);
    }

    const data = {'organizations': organizations};
    return utils.sendResponse(res, data);
  }catch(err) {
      console.error(`Error getOrgMembers: ${err}`);
      console.trace();
      return utils.sendError.InternalError(err, res);
  }


};

/**
  * @public
  * @method getOrganization
  * @description __URL__: /api/organization/:id
  * @returns {Object} An organization object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
*/

const getOrganization = (req, res, next) => {
  models.Organization.findById(req.params.id)
  .exec((err, organization) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'organization': organization};
    utils.sendResponse(res, data);
  });
};

function canPostOrg(user) {
  if (!user) {
    return false;
  }
  const accountType = user.accountType;
  return accountType === 'A';
}
/**
  * @public
  * @method postOrganization
  * @description __URL__: /api/organizations
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
*/

const postOrganization = (req, res, next) => {
  const user = userAuth.requireUser(req);
  const canPost = canPostOrg(user);

  if (!canPost) {
    return utils.sendError.NotAuthorizedError(null, res);
  }
  // do we want to check if the user is allowed to create organizations?
  const organization = new models.Organization(req.body.organization);
  //organization.createdBy = user;
  organization.createDate = Date.now();
  organization.save((err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'organization': doc};
    utils.sendResponse(res, data);
  });
};

/**
  * @public
  * @method putOrganization
  * @description __URL__: /api/organizations/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/

const putOrganization = (req, res, next) => {
  const user = userAuth.requireUser(req);
  // what check do we want to perform if the user can edit
  // if they created the organization?
  models.Organization.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // make the updates
    for(let field in req.body.organization) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.organization[field];
      }
    }
    doc.save((err, organization) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'organization': organization};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.organizations = getOrganizations;
module.exports.get.organization = getOrganization;
module.exports.post.organization = postOrganization;
module.exports.put.organization = putOrganization;
/* jshint ignore:end */
