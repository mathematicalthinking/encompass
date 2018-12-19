/**
  * # Answer API
  * @description This is the API for answer based requests
  * @author Michael McVeigh
*/
/* jshint ignore:start */
//REQUIRE MODULES
const logger = require('log4js').getLogger('server');
const apiUtils = require('../../datasource/api/utils');
const _ = require('underscore');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
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

// eslint-disable-next-line complexity
async function getAnswers(req, res, next) {
  var user = userAuth.requireUser(req);

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
      let startDateObj = new Date(startDate);
      let endDateObj = new Date(endDate);

      if (_.isDate(startDateObj) && _.isDate(endDateObj)) {
        filterBy.createDate = {
          $gte: startDateObj,
          $lte: endDateObj
        };
      }
    }

    if (apiUtils.isNonEmptyArray(students)) {
      let pruned = apiUtils.cleanObjectIdArray(students);

      if (apiUtils.isNonEmptyArray(pruned)) {
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

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  // Add permission checks here
  const answer = new models.Answer(req.body.answer);

  answer.createDate = Date.now();
  await answer.save((err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'answer': doc};
    utils.sendResponse(res, data);
    next();
  }).then((answer) => {
    models.Problem.findById(answer.problem).exec().then((problem) => {
      if (!problem.isUsed) {
        problem.isUsed = true;
      }
      problem.save();
    });
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
    if (doc.isSubmitted) {
      logger.error("answer already submitted");
      return utils.sendError.NotAuthorizedError('Answer has already been submitted', res);
    }

    // if (doc.isTrashed) {
    //   models.Problem.findById(answer.problem).exec().then((problem) => {
    //     if (problem.isUsed) {
    //       models.Answer.findOne({ isTrashed: false, problem: problem.id }).exec().then((answer) => {
    //         console.log('answer is', answer);
    //         if (answer === null) {
    //           problem.isUsed == false;
    //           problem.save();
    //         }
    //       });
    //     }
    //   });
    // }

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