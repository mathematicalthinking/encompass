const _ = require('underscore');

/**
 * Returns true if passed in value is null or undefined else false
 * @param {any} val
 * @returns {boolean}
 */
function isNil(val) {
  return _.isNull(val) || _.isUndefined(val);
}

/**
 * Returns true if passed in value is an array with length > 0 else false
 * @param {any} val
 * @returns {boolean}
 */
function isNonEmptyArray(val) {
  return _.isArray(val) && !_.isEmpty(val);
}
/**
 * Returns true if passed in value is a string with length > 0 else false
 * @param {any} val
 * @returns {boolean}
 */
function isNonEmptyString(val) {
  return _.isString(val) && val.length > 0;
}

/**
 * Returns true if passed in value is an object (non-array, non-function)
 * with at least one enumerable own-property else false
 * @param {any} val
 * @returns {boolean}
 */
function isNonEmptyObject(val) {
  return _.isObject(val) && !_.isArray(val) && !_.isFunction(val) && !_.isEmpty(val);
}

module.exports.isNil = isNil;
module.exports.isNonEmptyArray = isNonEmptyArray;
module.exports.isNonEmptyString = isNonEmptyString;
module.exports.isNonEmptyObject = isNonEmptyObject;