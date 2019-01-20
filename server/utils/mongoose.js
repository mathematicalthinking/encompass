const _ = require('underscore');

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
 * @returns { boolean }
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

  module.exports.isValidMongoId = isValidMongoId;
  module.exports.areObjectIdsEqual = areObjectIdsEqual;
