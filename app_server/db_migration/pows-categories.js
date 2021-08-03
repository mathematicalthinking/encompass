const mongoose = require('mongoose');
var fs = require('fs');
const csv = require('csvtojson');
const _ = require('underscore');

const models = require('../datasource/schemas');
mongoose.Promise = global.Promise;

 mongoose.connect('mongodb://localhost:27017/encompass');

// puzzleId, title, //[category identifier]

let dir = __dirname;

let pathToFiles = `${dir}/data/PoW-CCSSalignments`;

let files = fs.readdirSync(pathToFiles); // array of file names

/* map to array of objects in form
{
  puzzleId: number
  title: string
  identifiers: comma separated strings
}
*/

let duplicateCategories = [];
let missingIdentifiers = [];
let missingPuzzles = [];

let categoryPrefix = 'CCSS.Math.Content.';

function mapIdentifiersToCategoryIds(identifiers) {
  let cats = identifiers.map((i => {
    return models.Category.find({identifier: i}, {_id: 1}).lean().exec()
    .then((categories) => {
      if (categories.length > 1) {
        duplicateCategories.push(categories[0]);
      }
      let cat = categories[0];

      if (cat) {
        return cat._id;
      } else {
        console.log('missing identifier', i);
        missingIdentifiers.push(i);
      }
    });
  }));
  return Promise.all(cats);
}

function getEncompassProblemIdFromPuzzleId(puzzleId) {
  return models.Problem.find({puzzleId: puzzleId}, {_id: 1}).lean().exec()
  .then((problems) => {
    let prob = problems[0];
    if (!prob) {
      console.log(`No problem found for puzzleId: ${puzzleId}`);
      missingPuzzles.push(puzzleId);
    } else {
      return prob._id;
    }
  });
}

async function convertToJson() {
  try {
    let results = await Promise.all(files.map((f) => {
      return csv().fromFile(`${pathToFiles}/${f}`);
    }));

    results = _.flatten(results);

    let puzzleIds = _.map(results, obj => obj.puzzleId);
    console.log(`There are ${puzzleIds.length} problems`);

    let uniqPuzzles = _.uniq(puzzleIds);
    console.log(`There are ${uniqPuzzles.length} unique problems`);

    // puzzleId is a string i.e. '1170'
    // identifiers is a comma separated string of identifiers
    // need to trim before splitting
    // title is problem title

    let formatted = results.map((obj) => {
      let newObj = {};

      let puzzleId = obj.puzzleId;
      let intPuzzleId = parseInt(puzzleId, 10);
      newObj.puzzleId = intPuzzleId;

      let identifiers = obj.identifiers.trim();

      let splitIdentifiers = identifiers.split(',');

      splitIdentifiers = _.without(splitIdentifiers, '');

      newObj.categories = splitIdentifiers;

      newObj.categories = newObj.categories.map((i) => {
        let trimmed = i.trim();

        if (trimmed[0] === '.') {
          // console.log(`startsWithPeriod identifier ${i}:`);
          trimmed = trimmed.slice(1); // get rid of initial period so no .. when categoryPrefix is prepended
        }

        if (trimmed.includes('-')) {
          // replace dash with period to match format in encompass db
            trimmed = trimmed.replace('-', '.');
        }

        let name = `${categoryPrefix}${trimmed}`;
        if (name === 'CCSS.Math.Content.6.EE.C.6') {
          console.log('obj', obj);
        }
        return name;
      });
      return newObj;
    });
    // convert array of json objects to dictionary object where
    // keys are string versions of puzzleIds, and values are puzzleId and array of (unique) categoryIds
    // keys are unique
    let dict = {};

    for (let obj of formatted) {
      let puzzleId = obj.puzzleId;
      let dictVal = dict[puzzleId];

      if (_.isUndefined(dictVal)) {
        dict[puzzleId] = obj;
      } else {
        let dictCats = dictVal.categories;

        for (let i of obj.categories) {
          if (!_.contains(dictCats, i)) {
            dictCats.push(i);
          }
        }
      }
    }

    return dict;
  } catch(err) {
  console.log(err);
  }
}

async function migrate() {
  try {
    let json = await convertToJson();

    for (let key of Object.keys(json)) {
      let idents = json[key].categories;
      json[key].categoryIds = await mapIdentifiersToCategoryIds(idents);
      if (_.contains(json[key].categoryIds, undefined)) {
        console.log('includes undef', json[key]);
      }

      let puzzleId = json[key].puzzleId;
      let problemId = await getEncompassProblemIdFromPuzzleId(puzzleId);

      // findAndUpdate problem - add categories to problems category array
      let test = await models.Problem.update({_id: problemId}, {$addToSet: { categories: {$each: json[key].categoryIds }  } });
    }
    console.log(`Number of missing identifiers: ${missingIdentifiers.length}`);
    console.log(`Number of missing puzzles: ${missingPuzzles.length}`);
    console.log(`Number of duplicate categorys: ${duplicateCategories.length}`);
    console.log('done!');
  }catch(err) {
    console.log('err migrate', err);
  }
}

migrate();
