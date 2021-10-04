/**
  * # Notification API
  * @description This is the API for notification based requests
*/

//REQUIRE MODULES
const _ = require('underscore');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');
const access = require('../../middleware/access/notifications');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject } = objectUtils;

const { isValidMongoId } = require('../../utils/mongoose');


module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

const getNotifications = (req, res, next) => {
  let user = userAuth.requireUser(req);

  let { ids, filterBy } = req.query;

  let criteria = access.get.notifications(user, ids, filterBy);
  if (!isNonEmptyObject(criteria)) {
    return utils.sendError.InternalError(null, res);
  }

  return models.Notification.find(criteria)
    .then((notifications) => {
      return utils.sendResponse(res, {
        notifications
      });
    })
    .catch((err) => {
      console.error(`Error getNotifications: ${err}`);
      console.trace();
      return utils.sendError.InternalError(null, res);
    });
};

const getNotification = (req, res, next) => {
  let user = userAuth.requireUser(req);
  let { id } = req.params;

  return models.Notification.findById(id)
    .then((notification) => {
      if (!notification || notification.isTrashed) {
        return utils.sendResponse(res, null);
      }
      if (!access.get.notification(user, notification._id)) {
        return utils.sendError.NotAuthorizedError(null, res);
      }
      return utils.sendResponse(res, {
        notification
      });
    })
    .catch((err) => {
      console.error(`Error getNotification: ${err}`);
      console.trace();
      return utils.sendError.InternalError(null, res);

    });
};

const postNotification = (req, res, next) => {
  let user = userAuth.requireUser(req);

  let { createDate, createdBy } = req.body.notification;

  if (!isValidMongoId(createdBy)) {
    req.body.createdBy = user._id;
  }

  if (!createDate) {
    req.body.createDate = Date.now();
  }

  req.body.lastModifiedDate = req.body.createDate;

  let newNotification = new models.Notification(req.body.notification);

  return newNotification.save()
    .then((notification) => {
      return utils.sendResponse(res, {
        notification
      });
    })
    .catch((err) => {
      console.error(`Error postNotification: ${err}`);
      console.trace();
      return utils.sendError.InternalError(null, res);
    });
};

const putNotification = async (req, res, next) => {
  try {
    let user = userAuth.requireUser(req);

    let id = req.params.id;

    let notification = await models.Notification.findById(id);

    if (!notification || notification.isTrashed) {
      return utils.sendResponse(res, null);
    }

    let { wasSeen, isTrashed } = req.body.notification;

    if (_.isBoolean(wasSeen)) {
      notification.wasSeen = wasSeen;
    }

    if (_.isBoolean(isTrashed)) {
      notification.isTrashed = isTrashed;
    }

    let savedNtf = await notification.save();
    return utils.sendResponse(res, {
      notification: savedNtf
    });

  }catch(err) {
    console.error(`Error putNotification: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
};

module.exports.get.notifications = getNotifications;
module.exports.get.notification = getNotification;
module.exports.post.notification = postNotification;
module.exports.put.notification = putNotification;