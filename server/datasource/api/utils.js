const _ = require('underscore');
const models = require('../schemas');


async function filterByForeignRef(model, searchQuery, pathToPopulate, foreignField, filterCriteria,) {
  try {
    let query = searchQuery.replace(/\s+/g, "");
    let regex = new RegExp(query.split('').join('\\s*'), 'i');

    if (!filterCriteria) {
      filterCriteria = {isTrashed: false};
    }

    let matchHash = { [foreignField]: regex };


  let records = await models[model].find({isTrashed: false}, {pathToPopulate: 1}).populate({path: pathToPopulate, match: matchHash, select: foreignField }).lean().exec();

  let matches = _.filter(records, (record => {
    let val = record[pathToPopulate];
    console.log('val', val);
    return val !== null;
  }));
  return _.map(matches, match => match._id.toString());

  }catch(err) {
    console.error(`Error filterByForeignRef: ${err}`);
  }

}

async function filterByForeignRefArray(model, searchQuery, pathToPopulate, foreignField, filterCriteria,) {
  try {
    let query = searchQuery.replace(/\s+/g, "");
    let regex = new RegExp(query.split('').join('\\s*'), 'i');

    if (!filterCriteria) {
      filterCriteria = {isTrashed: false};
    }

    let matchHash = { match: {[foreignField]: { $ne: [] } }};


  let records = await models[model].find({isTrashed: false}, {pathToPopulate: 1}).populate({path: pathToPopulate, matchHash, select: foreignField }).lean().exec();

  let matches = _.filter(records, (record => {
    let arr = record[pathToPopulate];
    return !_.isUndefined(_.find(arr, (obj) => {
      return obj[foreignField].match(regex) !== null;
    }));
  }));
  return _.map(matches, match => match._id.toString());
  }catch(err) {
    console.error(`Error filterByForeignRef: ${err}`);
  }
}

async function findAndReturnIds(model, criteria, asStrings=true) {
  try {
    let records = await models[model].find(criteria, {_id: 1}).lean().exec();

    if (asStrings) {
      return _.map(records, record => record._id.toString());
    }
    return _.map(records, record => record._id);
  }catch(err) {
    console.log(`Error findAndReturnIds: ${err}`);
  }
}

async function getUniqueIdsFromQueries(model, criteria) {
  try {
    if (!model) {
      return;
    }
    let lists = await Promise.all(_.map(criteria, criterion => {
      return findAndReturnIds(model, criterion);
    }));

    let flattened = _.flatten(lists);

    return _.uniq(flattened);
  }catch(err) {
    console.error(`Error getUniqueIdsFromQueries: ${err}`);
  }
}

function isNullOrUndefined(val) {
  return _.isNull(val) || _.isUndefined(val);
}

function isNonEmptyArray(val) {
  return _.isArray(val) && !_.isEmpty(val);
}

// return input string with first letter capitalized
function capitalizeWord(str) {
  if (!_.isString(str)) {
    return;
  }
  if (str.length === 0) {
    return '';
  }

  let firstLetterCap = str.charAt(0).toUpperCase();
  if (str.length === 1) {
    return firstLetterCap;
  }
  let slicedFrom1 = str.slice(1);
  return firstLetterCap + slicedFrom1;
}
// expects space separated string, e.g. Alice Williams
function getSafeName(str) {
  if (!_.isString(str)) {
    return;
  }
  if (str.length === 0) {
    return '';
  }

  let split = str.split(' ');
  let firstName = this.capitalizeWord(split[0]);
  let lastName;

  if (split[1]) {
    let firstChar = split[1].charAt(0);
    // let firstCharCap = this.capitalize(firstChar);
    lastName = this.capitalizeWord(firstChar);
  }
  return `${firstName} ${lastName}.`;
}

function capitalizeString(str) {
  if (!_.isString(str)) {
    return;
  }
  if (str.length === 0) {
    return '';
  }

  let words = str.split(' ');
  let mapped = _.map(words, (word) => {
    return this.capitalizeWord(word);
  });
  return mapped.join(' ');
}


module.exports.filterByForeignRef = filterByForeignRef;
module.exports.filterByForeignRefArray = filterByForeignRefArray;
module.exports.findAndReturnIds = findAndReturnIds;
module.exports.getUniqueIdsFromQueries = getUniqueIdsFromQueries;
module.exports.isNullOrUndefined = isNullOrUndefined;
module.exports.isNonEmptyArray = isNonEmptyArray;
module.exports.capitalizeString = capitalizeString;
module.exports.capitalizeWord = capitalizeWord;
module.exports.getSafeName = getSafeName;