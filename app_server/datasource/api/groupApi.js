/**
 * # SectionGroup API
 * @description This is the API for SectionGroup based requests
 * @author Tim Leonard
 */

const _ = require('underscore');

const logger = require('log4js').getLogger('server');
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const access = require('../../middleware/access/sections');

const { isNonEmptyArray } = require('../../utils/objects');

module.exports.get = {};
module.exports.post = {};

/**
 * @public
 * @method getGroups
 * @description __URL__: /api/groups
 * @returns {Object} An array of sectiongroup objects
 * @throws {NotAuthorizedError} User has inadequate permissions
 * @throws {InternalError} Data retrieval failed
 * @throws {RestError} Something? went wrong
 */

const getGroups = async (req, res) => {
  let groups = await models.sectionGroups.find();
  return utils.sendResponse(res, { sectionGroups: groups });
};

/**
 * @public
 * @method getGroup
 * @description __URL__: /api/group/:id
 * @returns {Object} An section group object
 * @throws {NotAuthorizedError} User has inadequate permissions
 * @throws {InternalError} Data retrieval failed
 * @throws {RestError} Something? went wrong
 */

const getGroup = (req, res) => {
  return;
};

/**
 * @public
 * @method postGroup
 * @description __URL__: /api/group
 * @throws {NotAuthorizedError} User has inadequate permissions
 * @throws {InternalError} Data saving failed
 * @throws {RestError} Something? went wrong
 */

const postGroup = async (req, res) => {
  console.log(req.body);
  const user = userAuth.requireUser(req);
  const sectionGroup = new models.Group(req.body.group);
  sectionGroup.createdBy = user;
  sectionGroup.createDate = new Date();
  try {
    let createdGroup = await sectionGroup.save();
    const data = { group: createdGroup };
    return utils.sendResponse(res, data);
  } catch (err) {
    logger.error(err);
    return utils.sendError.InternalError(err, res);
  }
};

/**
 * @public
 * @method putGroup
 * @description __URL__: /api/group/:id
 * @throws {NotAuthorizedError} User has inadequate permissions
 * @throws {InternalError} Data update failed
 * @throws {RestError} Something? went wrong
 */

const putGroup = (req, res) => {
  return;
};

/**
 * @public
 * @method deleteSectionGroup
 * @description __URL__: /api/group/:id
 * @throws {NotAuthorizedError} User has inadequate permissions
 * @throws {InternalError} Data update failed
 * @throws {RestError} Something? went wrong
 */

const deleteSection = (req, res) => {
  return;
};

module.exports.get.groups = getGroups;
module.exports.post.groups = postGroup;
