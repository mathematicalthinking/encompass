const { ObjectId } = require('mongoose').Types;

module.exports.ObjectId = ObjectId;

module.exports.ISODate = (dateString) => {
  return new Date(dateString);
};
