const utils = require('./utils');
const _ = require('underscore');
const mongooseUtils = require('../../utils/mongoose');
const objectUtils = require('../../utils/objects');

const { isValidMongoId } = mongooseUtils;
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;

module.exports.get = {};

const accessibleNotificationsQuery = function(user, ids, filterBy) {
  try {
    if (!isNonEmptyObject(user)) {
      return;
    }

    let filter = {
      $and: [
        { isTrashed: false },
        { $or: [
          { recipient: user._id },
          { createdBy: user._id }
        ]}
      ]
    };

    if (isNonEmptyArray(ids)) {
      filter.$and.push({ _id: { $in : ids } });
    } else if(isValidMongoId(ids)) {
      filter.$and.push({ _id: ids });
    }

    if (isNonEmptyObject(filterBy)) {
      let allowedKeyHash = {
        workspace: true,
        submission: true,
        createdBy: true,
        recipient: true,
        notificationType: true,
        wasSeen: true,
      };
      _.each(filterBy, (val, key) => {
        if (allowedKeyHash[key]) {
          filter.$and.push({[key]: val});
        }
      });
    }

    return filter;

  }catch(err) {
    console.trace();
    console.error(`error building accessible notifications critera: ${err}`);
  }
};

const canGetNotification = async function(user, notificationId) {
  try {
    if (!isNonEmptyObject(user)) {
      return false;
    }

    let criteria = await accessibleNotificationsQuery(user, notificationId);

    return utils.doesRecordExist('Notification', criteria);
  } catch(err) {
    console.error(`Error canGetNotification: ${err}`);
  }
};

module.exports.get.notifications = accessibleNotificationsQuery;
module.exports.get.notification = canGetNotification;
