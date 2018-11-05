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

module.exports.filterByForeignRef = filterByForeignRef;
module.exports.filterByForeignRefArray = filterByForeignRefArray;