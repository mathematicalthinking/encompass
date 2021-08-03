const _ = require('underscore');
const models = require('../schemas');
const mongoose = require('mongoose');
const sharp = require('sharp');
const htmlParser = require('htmlparser2');

const mongooseUtils = require('../../utils/mongoose');
const objectUtils = require('../../utils/objects');
const stringUtils = require('../../utils/strings');

const { isNonEmptyArray, isNonEmptyString } = objectUtils;

const { isValidMongoId, cleanObjectIdArray } = mongooseUtils;

const { getFirstCharOfStr, removeExtraSpacesFromStr, getNthWordOfStr, capitalizeString } = stringUtils;

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
    console.error(`Error findAndReturnIds: ${err}`);
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

  // Match Obj takes the passed in criteria, as well as checking sortable field exists
  criteria.$and.forEach((criterion) => {
    if (criterion.hasOwnProperty('createdBy')) {
      let value = criterion.createdBy;
      if (value.hasOwnProperty('$in')) {
        const pruned = cleanObjectIdArray(value.$in, true);
        if (isNonEmptyArray(pruned)) {
          value.$in = pruned;
        } else {
          delete value.$in;
        }
      } else {
        if (isValidMongoId(value)) {
          let updatedValue = mongoose.Types.ObjectId(value);
          criterion.createdBy = updatedValue;
        } else {
          // bad objectId, delete filter property
          delete criterion.createdBy;
        }
      }
    }
    if (criterion.hasOwnProperty('_id')) {
      let value = criterion._id;
      if (value.hasOwnProperty('$in')) {
        const pruned = cleanObjectIdArray(value.$in, true);
        if (isNonEmptyArray(pruned)) {
          value.$in = pruned;
        } else {
          delete value.$in;
        }
      } else {
        if (isValidMongoId(value)) {
          criterion._id = mongoose.Types.ObjectId(value);
        } else {
          // bad objectId, delete filter property
          delete criterion._id;
        }
      }
    }
    if (criterion.hasOwnProperty('$or')) {
      criterion.$or.forEach((crit) => {
        if (crit.hasOwnProperty('createdBy')) {
          let value = crit.createdBy;
          if (value.hasOwnProperty('$in')) {
            const pruned = cleanObjectIdArray(value.$in, true);
            if (isNonEmptyArray(pruned)) {
              value.$in = pruned;
            } else {
              delete value.$in;
            }
          } else {
            if (isValidMongoId(value)) {
              let updatedValue = mongoose.Types.ObjectId(value);
              crit.createdBy = updatedValue;
            } else {
              // bad objectId, delete filter property
              delete crit.createdBy;
            }
          }
        }
        if (crit.hasOwnProperty('owner')) {
          let value = crit.owner;
          if (value.hasOwnProperty('$in')) {
            const pruned = cleanObjectIdArray(value.$in, true);
            if (isNonEmptyArray(pruned)) {
              value.$in = pruned;
            } else {
              delete value.$in;
            }
          } else {
            if (isValidMongoId(value)) {
              let updatedValue = mongoose.Types.ObjectId(value);
              crit.owner = updatedValue;
            } else {
              // bad objectId, delete filter property
              delete crit.owner;
            }
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

const sortAnswersByLength = function(model, sortParam, req, criteria) {
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

   criteria.$and.forEach((criterion) => {
    if (criterion.hasOwnProperty('createdBy')) {
      let value = criterion.createdBy;
      if (value.hasOwnProperty('$in')) {
        const pruned = cleanObjectIdArray(value.$in, true);
        if (isNonEmptyArray(pruned)) {
          value.$in = pruned;
        } else {
          delete value.$in;
        }
      } else {
        if (isValidMongoId(value)) {
          let updatedValue = mongoose.Types.ObjectId(value);
          criterion.createdBy = updatedValue;
        } else {
          // bad objectId, delete filter property
          delete criterion.createdBy;
        }
      }
    }
    if (criterion.hasOwnProperty('_id')) {
      let value = criterion._id;
      if (value.hasOwnProperty('$in')) {
        const pruned = cleanObjectIdArray(value.$in, true);
        if (isNonEmptyArray(pruned)) {
          value.$in = pruned;
        } else {
          delete value.$in;
        }
      } else {
        if (isValidMongoId(value)) {
          criterion._id = mongoose.Types.ObjectId(value);
        } else {
          // bad objectId, delete filter property
          delete criterion._id;
        }
      }
    }
    if (criterion.hasOwnProperty('problem')) {
      let value = criterion.problem;
      if (value.hasOwnProperty('$in')) {
        const pruned = cleanObjectIdArray(value.$in, true);
        if (isNonEmptyArray(pruned)) {
          value.$in = pruned;
        } else {
          delete value.$in;
        }
      } else {
        if (isValidMongoId(value)) {
          let updatedValue = mongoose.Types.ObjectId(value);
          criterion.problem = updatedValue;
        } else {
          // bad objectId, delete filter property
          delete criterion.problem;
        }
      }
    }
    if (criterion.hasOwnProperty('$or')) {
      criterion.$or.forEach((crit) => {
        if (crit.hasOwnProperty('createdBy')) {
          let value = crit.createdBy;
          if (value.hasOwnProperty('$in')) {
            const pruned = cleanObjectIdArray(value.$in, true);
            if (isNonEmptyArray(pruned)) {
              value.$in = pruned;
            } else {
              delete value.$in;
            }
          } else {
            if (isValidMongoId(value)) {
              let updatedValue = mongoose.Types.ObjectId(value);
              crit.createdBy = updatedValue;
            } else {
              // bad objectId, delete filter property
              delete crit.createdBy;
            }
          }
        }
        if (crit.hasOwnProperty('problem')) {
          let value = crit.problem;
          if (value.hasOwnProperty('$in')) {
            const pruned = cleanObjectIdArray(value.$in, true);
            if (isNonEmptyArray(pruned)) {
              value.$in = pruned;
            } else {
              delete value.$in;
            }
          } else {
            if (isValidMongoId(value)) {
              let updatedValue = mongoose.Types.ObjectId(value);
              crit.problem = updatedValue;
            } else {
              // bad objectId, delete filter property
              delete crit.problem;
            }
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
  projNest.length = { "$strLenCP": '$' + sortField };

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

function mapObjectsToIds(objects, asStrings=false) {
  if (!isNonEmptyArray(objects)) {
    return;
  }

  if (asStrings) {
    return _.map(objects, obj => obj._id.toString());
  }
  return _.map(objects, obj => obj._id);

}

// used to ensure there is not already an existing record with

function getUniqueStrRegex(str) {
  if (!_.isString(str)) {
    return;
  }
  let copy = str.slice();
  copy = copy.replace(/\s+/g, "");
  let split = copy.split('').join('\\s*');
  let full = `^${split}\\Z`;
  return new RegExp(full, 'i');
}
function isRecordUniqueByStringProp(model, requestedValue, uniqueProp, optionsHash) {
  let regex = getUniqueStrRegex(requestedValue);
  if (!regex || !_.isString(model)) {
    return;
  }
  let baseOptions = {
    [uniqueProp]: { $regex: regex },
    isTrashed: false
  };
  let options;

  if (_.isObject(optionsHash)) {
    options = Object.assign(baseOptions, optionsHash);
  } else {
    options = baseOptions;
  }
  // if no record found, means no record exists with property
  // equal to requested value
  return models[model].findOne(options).lean().exec()
  .then((record) => {
    return record === null || record === undefined;
  });
}

function parseHtmlString(htmlString) {
  let result = [];

  let parser = new htmlParser.Parser({
    onopentag: function(name, attr) {
      result.push(['openTag', '<' + name]);

      _.each(attr, (val, key) => {
        result.push([`attr_${key}`, ` ${key}='${val}'`]);
      });
      result.push(['endOpenTag', '>']);
    },

    ontext: function(text) {
      result.push(['textContent', text]);
    },
    onclosetag: function(tagname) {
      let nonClosingTags = ['img', 'br'];
      if (!nonClosingTags.includes(tagname)) {
        result.push(['closeTag', '</' + tagname + '>']);
      }
    },
  }, {decodeEntities: true});

  parser.write(htmlString);
  parser.end();
  return result;
}

 function handleBase64Images(parsedHtmlEls, user) {
  return Promise.all(parsedHtmlEls.map(async (tuple) => {
    let [elType, el] = tuple;
    // for image src, elType will be attr_src
    let isImageSrc = elType === 'attr_src';

    if (!isImageSrc) {
      return el;
    }

    let first30Chars = typeof el === 'string' ? el.slice(0,29) : '';

    let target = 'base64,';
    let targetIndex = first30Chars.indexOf(target);

    let isImageData = targetIndex !== -1;

    if (!isImageData) {
      return el;
    }
    let dataStartIndex = targetIndex + target.length;
    // does not include last char which is closing quote
    let imageDataStr = el.slice(dataStartIndex);

    let dataFormatStartIndex = first30Chars.indexOf('data:');
    let imageDataStrWithFormat = el.slice(dataFormatStartIndex);

    let origBuffer = Buffer.from(imageDataStr, 'base64');

    let originalSharp = sharp(origBuffer);

    let originalMetadata = await originalSharp.metadata();
    let sizeThreshold = 614400; // 600kb
    let widthThreshold = 1000; // 1000 pixels wide max

    let { size, width, format, height } = originalMetadata;

    let newImage = new models.Image({
      originalSize: size,
      originalWidth: width,
      originalHeight: height,
      originalMimetype: `image/${format}`,
      createdBy: user,
    });

    let isOverSizeLimit = size > sizeThreshold;
    let isOverWidthLimit = width > widthThreshold;

    if (!isOverSizeLimit && !isOverWidthLimit) {
      newImage.imageData = imageDataStrWithFormat;
      newImage.size = size;
      newImage.width = width;
      newImage.height = height;
    } else {
      let resizedBuffer = await sharp(origBuffer).resize(500).toBuffer();
      let newMetadata = await sharp(resizedBuffer).metadata();

      newImage.size = newMetadata.size;
      newImage.width = newMetadata.width;
      newImage.height = newMetadata.height;
      newImage.mimetype = `image/${newMetadata.format}`;

      let newImageDataStr = resizedBuffer.toString('base64');

      newImage.imageData = `data:image/${format};base64,${newImageDataStr}`;

    }
    await newImage.save();

    let url = `/api/images/file/${newImage._id}`;
    return ` src='${url}'`;
  }))
  .then((arr) => {
    return arr.join('');
  })
  .catch((err) => {
    console.log('err handleBase64Images', err);
  });
}

module.exports.filterByForeignRef = filterByForeignRef;
module.exports.filterByForeignRefArray = filterByForeignRefArray;
module.exports.findAndReturnIds = findAndReturnIds;
module.exports.getUniqueIdsFromQueries = getUniqueIdsFromQueries;
module.exports.getSafeName = getSafeName;
module.exports.sortWorkspaces = sortWorkspaces;
module.exports.cloneDocuments = cloneDocuments;
module.exports.mapObjectsToIds = mapObjectsToIds;
module.exports.sortAnswersByLength = sortAnswersByLength;
module.exports.isRecordUniqueByStringProp = isRecordUniqueByStringProp;
module.exports.parseHtmlString = parseHtmlString;
module.exports.handleBase64Images = handleBase64Images;