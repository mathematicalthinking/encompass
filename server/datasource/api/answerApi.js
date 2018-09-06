/**
  * # Answer API
  * @description This is the API for answer based requests
  * @author Michael McVeigh
*/
/* jshint ignore:start */
//REQUIRE MODULES
const _ = require('underscore');
const logger = require('log4js').getLogger('server');

//REQUIRE FILES
const models = require('../schemas');
const auth = require('./auth');
const userAuth = require('../../middleware/userAuth');
const permissions = require('../../../common/permissions');
const utils = require('../../middleware/requestHandler');
const access= require('../../middleware/access/answers');


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

  // teacher needs to be able to access student's answers
  // check if answer is in one of teacher's assignments

const getAnswers = async function(req, res, next) {
  const user = userAuth.requireUser(req);
  let ids;
  let criteria;

  // array of oids
  if (req.query.ids) {
    ids = req.query.ids;
    criteria = await access.get.answers(user, ids);
  } else if (req.query.problem) {
    criteria = req.query;
    const requestedAnswers = await models.Answer.find(criteria).exec();
    let data = {
      'answers': requestedAnswers
    };
    return utils.sendResponse(res, data);
    // criteria = search answers by problem id;
  } else {
    criteria = await access.get.answers(user);
  }

  models.Answer.find(criteria)
  .exec((err, answers) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'answers': answers};
    utils.sendResponse(res, data);
    next();
  });
};


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
    const data = {'answer': answer};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postAnswer
  * @description __URL__: /api/answers
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

 const postAnswer = async function(req, res, next) {
  const user = userAuth.requireUser(req);
  // Add permission checks here
  const answer = new models.Answer(req.body.answer);
  // const uploadedFileId = answer.uploadedFileId;
  // console.log('uploadedFileId', uploadedFileId);
  // // use uploadedFileId to get image data and set on record
  // try {
  //   if (uploadedFileId) {
  //     console.log('uploadedFileId', uploadedFileId);
  //     const image = await models.Image.findById(uploadedFileId);
  //     console.log('image', image);
  //     //answer.imageSrc = `<img src="${image.data}" alt="${imageAlt}">`
  //     answer.imageData = image.data;
  //   }
  // }catch(err) {
  //   logger.error(err);
  //   return utils.sendError.InternalError(err, res);
  // }

  answer.createDate = Date.now();
  answer.save((err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'answer': doc};
    utils.sendResponse(res, data);
    next();
  });
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
  // what check do we want to perform if the user can edit
  // if they created the answer?
  models.Answer.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // if this has been submitted it is no longer editable
    // return an error
    if (doc.isSubmitted) {
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
/* jshint ignore:end */