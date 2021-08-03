const _ = require('underscore');
const mongoose = require('mongoose');

const { isNonEmptyArray, isNil } = require('../utils/objects');
/**
 * Returns true if passed in value matches format for mongoose objectId else false
 * @param {any} val
 * @returns {boolean}
 */
const isValidMongoId = (val) => {
  let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
  return checkForHexRegExp.test(val);
};

// used in cases where we are only interested in read-only comparisons
/**
 * Returns true if a and b are equivalent representations of Mongoose ObjectIds
 * (either as ObjectId or HexString) else false
 * @param {any} a - 1st value to compare
 * @param {any} b - 2nd value to compare
 * @returns {boolean}
 */
const areObjectIdsEqual = (a, b) => {
  if (!isValidMongoId(a) || !isValidMongoId(b)) {
    return false;
  }

  let type1 = typeof a;
  let type2 = typeof b;

  if (type1 === 'string' && type2 === 'string') {
    return a === b;
  }

  if (type1 === 'object' && type2 === 'object') {
    return _.isEqual(a, b);
  }
  let a2;
  let b2;

  // one must be type string, one must be type object

  if (type1 === 'string') {
    a2 = a;
  } else {
    a2 = a.toString();
  }

  if (type2 === 'string') {
    b2 = b;
  } else {
    b2 = b.toString();
  }

  return a2 === b2;
};

/**
 * Takes an array and filters out any values that do not match the proper format for a mongoose
 objectId (hex string or objectId instance). If 2nd argument is passed in as true, will convert  each value to an ObjectId instance.
 * @param {array} arr- array to clean
 * @param {boolean} [doConvert=false] - whether or not to convert to ObjectIds
 * @returns {array}
 */
function cleanObjectIdArray(arr, doConvert=false) {
  if (!isNonEmptyArray(arr)) {
    return [];
  }

  const filtered = _.filter(arr, isValidMongoId);

  if (!doConvert) {
    return filtered;
  }

  return _.map(filtered, val => mongoose.Types.ObjectId(val));
}

const doesObjectIdSetContainObjectId = (objectIds, objectIdToAdd) => {
  if (!Array.isArray(objectIds) || !isValidMongoId(objectIdToAdd)) {
    return false;
  }
  let existingId = _.find(objectIds, id => {
    return areObjectIdsEqual(id, objectIdToAdd);
  });

  return !isNil(existingId);
};

const addToObjectIdSet = (objectIds, objectIdToAdd) => {
  if (!Array.isArray(objectIds) || !isValidMongoId(objectIdToAdd)) {
    return false;
  }

  if (doesObjectIdSetContainObjectId(objectIds, objectIdToAdd)) {
    return false;
  }
  objectIds.push(objectIdToAdd);
  return true;
};
/** Returns 0 if values did not change, 1 if value was added, -1 if value
 * was removed
*
* @param {any} originalValue - value of field before update
* @param {any} newValue - value of field after update
* @returns {0 | 1 | -1 }
*/
const auditObjectIdField = (originalValue, newValue) => {
  let isOrigValidId = isValidMongoId(originalValue);
  let isNewValidId = isValidMongoId(newValue);

  if (!isOrigValidId && !isNewValidId) {
    // was empty and still is empty
    return 0;
  }

  if (areObjectIdsEqual(originalValue, newValue)) {
    // same Id
    return 0;
  }

  // one is valid id, one is not

  if (isValidMongoId(newValue)) {
    // updating field
    return 1;
  }

  // value was removed
  return -1;
};

/** Returns true if arrays do not contain the same object id members

* @param {any} originalValues - value of array field before update
* @param {any} newValues - value of array field after update
* @returns { boolean }
*/

const didObjectIdArrayFieldChange = (originalValues, newValues) => {
  // if both are not arrays, return true
  if (!Array.isArray(originalValues) && !Array.isArray(newValues)) {
    return false;
  }

  if (!Array.isArray(originalValues) || !Array.isArray(newValues)) {
    // one value is array, one is not
    return true;
  }

  // both values must be arrays now
  if (originalValues.length !== newValues.length) {
    return true;
  }

  // both arrays have same length
  // only way to be equal is both arrays consist of same objectIds

  let originalValuesMap = {};

  originalValues.forEach((val) => {
    originalValuesMap[val] = true;
  });

  for(let newValue of newValues) {
    // iterate over newValues, and if we find a value that does not
    // exist in the originalValuesMap, we can return early with true
    if (!originalValuesMap[newValue]) {
      return true;
    }
  }

  // all values in newValues are in oldValues
  return false;

};

  module.exports.isValidMongoId = isValidMongoId;
  module.exports.areObjectIdsEqual = areObjectIdsEqual;
  module.exports.cleanObjectIdArray = cleanObjectIdArray;
  module.exports.addToObjectIdSet = addToObjectIdSet;
  module.exports.doesObjectIdSetContainObjectId = doesObjectIdSetContainObjectId;
  module.exports.auditObjectIdField = auditObjectIdField;
  module.exports.didObjectIdArrayFieldChange = didObjectIdArrayFieldChange;