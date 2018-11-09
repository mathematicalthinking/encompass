const _ = require('underscore');
const models = require('../schemas');
const mongoose = require('mongoose');

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
// model should be schema name (e.g. 'Workspace' or  'Comment')
// criteria should be filter object , e.g. { isTrashed: false }
// returns array of objectIds (as Sstrings if asStrings=true)
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

// model should be schema name (e.g. 'Workspace' or  'Comment')
// criteria should be an array of filter objects, e.g. [ { isTrashed: false }, ... ]
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

function isNonEmptyString(val) {
  return _.isString(val) && val.length > 0;
}

// not array or function
function isNonEmptyObject(val) {
  return _.isObject(val) && !_.isArray(val) && !_.isFunction(val) && !_.isEmpty(val);
}

function getFirstCharOfStr(str) {
  if (!_.isString(str)) {
    return;
  }
  if (str.length === 0) {
    return '';
  }
  return str.charAt(0);
}

// trim leading and trailing whitespaces and also remove excess whitespaces between words
// e.g. 'alex    williams ' -> 'alex williams'
function removeExtraSpacesFromStr(str) {
  if (!_.isString(str)) {
    return;
  }
  if (str.length === 0) {
    return '';
  }

  let copy = str.slice();
  let trimmed = copy.trim();
  let words = trimmed.split(' ');

  return _.chain(words)
    .without('')
    .join(' ')
    .value();
}

function getNthWordOfStr(str, n, doRemoveExtraSpaces) {
  if (!_.isString(str) || !_.isNumber(n)) {
    return;
  }
  if (str.length === 0) {
    return '';
  }
  let copy = str.slice();

  if (doRemoveExtraSpaces) {
    copy = removeExtraSpacesFromStr(copy);
  }

  let words = copy.split(' ');
  let numWords = words.length;
  let wordIndex = n;

  // if desired word index is greater than num of words, return last word
  if (wordIndex > numWords) {
    wordIndex = numWords;
  }
  return words[wordIndex];
}

// return input string with first letter capitalized
function capitalizeWord(str) {
  if (!_.isString(str)) {
    // throw Error?
    return;
  }
  if (str.length === 0) {
    return '';
  }
  let copy = str.slice();
  let trimmed = copy.trim();

  let firstLetterCap = trimmed.charAt(0).toUpperCase();

  if (trimmed.length === 1) {
    return firstLetterCap;
  }

  let slicedFrom1 = trimmed.slice(1);
  return firstLetterCap + slicedFrom1;
}

// expects a space delimited string
// returns new string with first letter of each word capitalized
function capitalizeString(str, doRemoveExtraSpaces) {
  if (!_.isString(str)) {
    // throw error?
    return;
  }
  if (str.length === 0) {
    return '';
  }
  let copy = str.slice();

  if (doRemoveExtraSpaces) {
    copy = removeExtraSpacesFromStr(copy);
  }


  let words = copy.split(' ');

  return _.chain(words)
    .map(capitalizeWord)
    .join(' ')
    .value();
}

// expects space separated string, e.g. alice Williams
// returns Alice W.
function getSafeName(str, doRemoveExtraSpaces, doCapitalize) {
  if (!_.isString(str)) {
    // throw error?
    return;
  }
  if (str.length === 0) {
    return '';
  }

  let copy = str.slice();

  let firstName;
  let lastName;
  let lastInitial;

  if (doRemoveExtraSpaces) {
    copy = removeExtraSpacesFromStr(copy);
  }

  if (doCapitalize) {
    copy = capitalizeString(copy);
  }

  firstName = getNthWordOfStr(copy, 0);
  lastName = getNthWordOfStr(copy, 1);

  if (isNonEmptyString(lastName)) {
    lastInitial = getFirstCharOfStr(lastName);
    return `${firstName} ${lastInitial}.`;
  }
  return firstName;
}

const sortWorkspaces = function(model, sortParam, req, criteria) {
  // Limit and skip are passed in with the req
  let limit = req.query.limit;
  let skip = req.skip;

  // Determine which field should be sorted and what value
  let sortField = Object.keys(sortParam)[0];
  let value = parseInt(sortParam[sortField], 0);

  let aggregateArray = [];

  // Creating objects to add to the aggregate pipeline
  let sortObj = { "$sort" : { "length": value } };
  let limitObj = { "$limit": limit };
  let skipObj = { "$skip": skip };

  console.log('criteria is', criteria);
  // Match Obj takes the passed in criteria, as well as checking sortable field exists
  criteria.$and.forEach((criterion) => {
    if (criterion.hasOwnProperty('createdBy')) {
      let value = criterion.createdBy;
      let updatedValue = mongoose.Types.ObjectId(value);
      criterion.createdBy = updatedValue;
    }
    if (criterion.hasOwnProperty('$or')) {
      criterion.$or.forEach((crit) => {
        if (crit.hasOwnProperty('createdBy')) {
          let value = crit.createdBy;
          let updatedValue = mongoose.Types.ObjectId(value);
          crit.createdBy = updatedValue;
        }
        if (crit.hasOwnProperty('owner')) {
          let value = crit.owner;
          if (value.hasOwnProperty('$in')) {
            value.$in.forEach((val) => {
              val = mongoose.Types.ObjectId(val);
            });
          } else {
            let updatedValue = mongoose.Types.ObjectId(value);
            crit.owner = updatedValue;
          }
        }
      });
    }
  });

  let matchObj = { "$match" : criteria };
  let matchNest = matchObj.$match;
  matchNest[sortField] = { $exists: true, $ne: null };

  // Project object iterates of keys of schema and then adds a length field to selected sortField
  let projectObj = { "$project" : { } };
  let projNest = projectObj.$project;
  let schema = require('mongoose').model(model).schema;
  let schemaObj = schema.obj;
  let ObjKeys = Object.keys(schemaObj);
  ObjKeys.forEach((key) => {
    projNest[key] = 1;
  });
  projNest.length = { "$size": '$' + sortField };

  // All objects are pushed into the aggregate array
  aggregateArray.push(matchObj, projectObj, sortObj, skipObj, limitObj);

  // Return results of aggregate by provied model
  return models[model].aggregate(aggregateArray).exec();
};


function cloneDocuments(model, documents) {

    if (!model) {
      return;
    }
    let input;
    // documents should be either a single document or an array of documents
    if (!_.isArray(documents)) {
      input = [document];
    } else {
      input = [ ...documents];
    }
    // returns array of new cloned docs
    return Promise.all(input.map((doc) => {
      return models[model].findById(doc._id).lean().exec()
      .then((json) => {
        delete json._id;
        let newDoc = new models[model](json);
        return newDoc.save();
      })
      .then((doc => {
        return doc;
      }))
      .catch((err) => {
        console.error(`Error cloneDocuments: ${err}`);
      });
    }));
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
module.exports.isNonEmptyString = isNonEmptyString;
module.exports.sortWorkspaces = sortWorkspaces;
module.exports.cloneDocuments = cloneDocuments;
module.exports.isNonEmptyObject = isNonEmptyObject;