/**
  * # Answer API
  * @description This is the API for answer based requests
  * @author Michael McVeigh
*/

//REQUIRE MODULES
const logger = require('log4js').getLogger('server');
const _ = require('underscore');
const moment = require('moment');
const htmlParser = require('htmlparser2');
const sharp = require('sharp');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const access= require('../../middleware/access/answers');
const wsApi = require('./workspaceApi');

const mongooseUtils = require('../../utils/mongoose');
const { cleanObjectIdArray } = mongooseUtils;

const objectUtils = require('../../utils/objects');
const { isNonEmptyArray, } = objectUtils;


module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getAnswers
  * @description __URL__: /api/answers
  * @returns {Object} An array of answer objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

// eslint-disable-next-line complexity
async function getAnswers(req, res, next) {
  try {
    let user = userAuth.requireUser(req);

    let { ids, problem, filterBy, searchBy, isTrashedOnly, didConfirmLargeRequest } = req.query;
    if (problem) {
      let criteria = req.query;
      const requestedAnswers = await models.Answer.findOne(criteria).exec();
      let data = {
        'answers': requestedAnswers
      };
      return utils.sendResponse(res, data);
    }

    if (filterBy) {
      let {startDate, endDate, students } = filterBy;

      if (startDate && endDate) {
        let startMoment = moment(startDate).startOf('day');
        let endMoment =  moment(endDate).endOf('day');
        let startDateObj = new Date(startMoment);

        let endDateObj = new Date(endMoment);

        if (_.isDate(startDateObj) && _.isDate(endDateObj)) {
          filterBy.createDate = {
            $gte: startDateObj,
            $lte: endDateObj
          };
        }
      }

      if (isNonEmptyArray(students)) {
        let pruned = cleanObjectIdArray(students);

        if (isNonEmptyArray(pruned)) {
          filterBy.createdBy = {$in: pruned};
        }
      }

      let propsToDelete = ['startDate', 'endDate', 'students'];
      _.each(propsToDelete, (prop) => {
        if (filterBy[prop]) {
          delete filterBy[prop];
        }
      });
    }

    let searchFilter = {};

    if (searchBy) {
      let { query, criterion } = searchBy;
      if (criterion) {
        if (criterion === 'all') {
          let topLevelStringProps = ['name'];
          query = query.replace(/\s+/g, "");
          let regex = new RegExp(query.split('').join('\\s*'), 'i');
          searchFilter.$or = [];
          for (let prop of topLevelStringProps) {
            searchFilter.$or.push({[prop]: regex});
          }
        } else {
          query = query.replace(/\s+/g, "");
          let regex = new RegExp(query.split('').join('\\s*'), 'i');

          searchFilter = {[criterion]: regex};
        }
      }
    }
      const criteria = await access.get.answers(user, ids, filterBy, searchFilter, isTrashedOnly);
      if (_.isNull(criteria)) {
        const data = {
          'answers': [],
          'meta': {
            'total': 0,
          }
        };
        return utils.sendResponse(res, data);
      }
      let results, itemCount;

      itemCount = await models.Answer.count(criteria);

      if (itemCount > 1000) {
        if (user.accountType !== 'A') {
          const data = {
            answers: [],
            meta: {
              total: itemCount,
              areTooManyAnswers: true
            }
          };

          return utils.sendResponse(res, data);

        } else if (didConfirmLargeRequest !== 'true') {
          const data = {
            answers: [],
            meta: {
              total: itemCount,
              doConfirmCriteria: true
          }
        };
        return utils.sendResponse(res, data);
      }

      } else if (itemCount > 500) {
        // return and ask for confirmation
        if (didConfirmLargeRequest !== 'true') {
          const data = {
            'answers': [],
            'meta': {
              'total': itemCount,
              'doConfirmCriteria': true
          }
        };
        return utils.sendResponse(res, data);
      }
    }

    // request has been confirmed or does not exceed size limit
    results = await models.Answer.find(criteria).lean().exec();
    const data = {
      'answers': results,
      'meta': {
        'total': itemCount,
      }
    };

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getAnswers: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }


}


/**
  * @public
  * @method getAnswer
  * @description __URL__: /api/answer/:id
  * @returns {Object} An answer object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getAnswer = (req, res, next) => {
  models.Answer.findById(req.params.id)
  .exec((err, answer) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if (!answer || answer.isTrashed) {
      return utils.sendResponse(res, null);
    }
    const data = {'answer': answer};
    utils.sendResponse(res, data);
    next();
  });
};

function parseExplanation(explanationString) {
  let result = [];

  let parser = new htmlParser.Parser({
    onopentag: function(name, attr) {
      result.push('<' + name);

      _.each(attr, (val, key) => {
        result.push(` ${key}='${val}'`);
      });
      result.push('>');
    },

    ontext: function(text) {
      result.push(text);
    },
    onclosetag: function(tagname) {
      let nonClosingTags = ['img', 'br'];
      if (!nonClosingTags.includes(tagname)) {
        result.push('</' + tagname + '>');
      }
    },
  }, {decodeEntities: true});

  parser.write(explanationString);
  parser.end();
  return result;
}

 function handleExplanation(parsedExplanation, user) {
  if (!Array.isArray(parsedExplanation)) {
    return '';
  }

  return Promise.all(parsedExplanation.map(async (el) => {

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
    console.log('orginal metadata', originalMetadata);
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
      console.log('new md', newMetadata);
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
    console.log('err handle explanation', err);
  });
}

/**
  * @public
  * @method postAnswer
  * @description __URL__: /api/answers
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

 const postAnswer = async function(req, res, next) {
   try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }
    // Add permission checks here
    const answer = new models.Answer(req.body.answer);

    let parsedExplanationEls = parseExplanation(answer.explanation);

    let convertedExplanation = await handleExplanation(parsedExplanationEls, user);

    answer.explanation = convertedExplanation;
    answer.createDate = Date.now();
    let savedAnswer = await answer.save();
    let updatedWorkspaceInfo;

    if (savedAnswer) {
      // check if should update workspace
      if (savedAnswer.workspaceToUpdate) {
      updatedWorkspaceInfo =  await wsApi.addAnswerToWorkspace(user, savedAnswer);
      }
    }
    // savedAnswer createdBy, problem, section were populated
    // need just id

    let problemId = _.propertyOf(savedAnswer)(['problem', '_id']);
    let sectionId = _.propertyOf(savedAnswer)(['section', '_id']);
    let creatorId = _.propertyOf(savedAnswer)(['createdBy', '_id']);


    if (problemId) {
      savedAnswer.problem = savedAnswer.problem._id;
    }
    // answers created from import might not have section
    if (sectionId) {
      savedAnswer.section = savedAnswer.section._id;
    }
    if (creatorId) {
      savedAnswer.createdBy = savedAnswer.createdBy._id;
    }
    let data = { 'answer': savedAnswer };
    if (updatedWorkspaceInfo) {
      data.meta = updatedWorkspaceInfo;
    }
    utils.sendResponse(res, data);
   }catch(err) {
     console.error(`Error postAnswer: ${err}`);
     console.trace();
     return utils.sendError.InternalError(null, res);
   }


};

/**
  * @public
  * @method putAnswer
  * @description __URL__: /api/answers/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {BadRequest} Answer is not editable
  * @throws {RestError} Something? went wrong
  */

const putAnswer = (req, res, next) => {
  const user = userAuth.requireUser(req);
  let isAdmin = user.accountType === 'A';

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  // what check do we want to perform if the user can edit
  // if they created the answer?
  models.Answer.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // if this has been submitted it is no longer editable
    // return an error
    if (doc.isSubmitted && !isAdmin) {
      logger.error("answer already submitted");
      return utils.sendError.NotAuthorizedError('Answer has already been submitted', res);
    }

    // make the updates
    for(let field in req.body.answer) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.answer[field];
      }
    }
    doc.save((err, answer) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'answer': answer};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.answers = getAnswers;
module.exports.get.answer = getAnswer;
module.exports.post.answer = postAnswer;
module.exports.put.answer = putAnswer;
