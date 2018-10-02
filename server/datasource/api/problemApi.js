/**
  * # Problem API
  * @description This is the API for problem based requests
*/
/* jshint ignore:start */
//REQUIRE MODULES
const _ = require('underscore');
const logger = require('log4js').getLogger('server');
const paginate = require('express-paginate');

//REQUIRE FILES
const models = require('../schemas');
const auth = require('./auth');
const userAuth = require('../../middleware/userAuth');
const permissions  = require('../../../common/permissions');
const utils    = require('../../middleware/requestHandler');
const access   = require('../../middleware/access/problems');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getProblems
  * @description __URL__: /api/problems
  * @returns {Object} An array of problem objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

// This only returns problems that are public or belong to you
// Needd to update to handle problems you participate in
function accessibleProblems(user) {
  let studentProblems = [];

  return models.Assignment.find({'_id': {$in: user.assignments}}).then((assignments) => {
      assignments.forEach((assn) => {
        studentProblems.push(assn.problem);
      });
      return studentProblems;
  })
  .then((probs) => {
    return {
      $or: [
        { createdBy: user },
        { privacySetting: "E" },
        { $and: [
          { organization: user.organization },
          { privacySetting: "O" }
        ]},
        {_id: {$in: probs}},
      ],
      isTrashed: false
    };
  })
  .catch((err) => {
    console.log(err);
  });

}
// query params support:
// ids
// filterBy
// sortBy
const getProblems = async function(req, res, next) {
  try {
    const user = userAuth.requireUser(req);
    if (!user) {
      return utils.sendError.InvalidCredentialsError(null, res);
    }
    let { ids, filterBy, sortBy, page, } = req. query;

    if (filterBy) {
      let {title, problemStatement } = filterBy;
      if (title) {
        title = title.replace(/\s+/g, "");
        let regex = new RegExp(title, 'i');
        filterBy.title = regex;
      }
      // currently no front end functionality for searching by problemStatement text
      // would need to optimize search by ignoring common words
      if (problemStatement) {
        problemStatement = problemStatement.replace(/\s+/g, "");
        let regex = new RegExp(problemStatement, 'i');
        filterBy.problemStatement = regex;
      }
    }

    const criteria = await access.get.problems(user, ids, filterBy);

    const [ results, itemCount ] = await Promise.all([
      models.Problem.find(criteria).limit(req.query.limit).skip(req.skip).lean().exec(),
      models.Problem.count(criteria)
    ]);

    // no front end functionality for sending sort query params but we should add that
    if (sortBy) {
      // handle sort
      // default sorting?
    }

    const pageCount = Math.ceil(itemCount / req.query.limit);

    let currentPage = page;
    if (!currentPage) {
      currentPage = 1;
    }
    const data = {
      'problems': results,
      'meta': {
        'total': itemCount,
        pageCount,
        currentPage
      }
  };
    utils.sendResponse(res, data);
    next();
  }catch(err) {
    console.error(`Error getProblems: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }


  // add permissions here

};

/**
  * @public
  * @method getProblem
  * @description __URL__: /api/problem/:id
  * @returns {Object} An problem object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

const getProblem = (req, res, next) => {
  const user = userAuth.requireUser(req);
  // add permissions here
  models.Problem.findById(req.params.id)
  .exec((err, problem) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'problem': problem};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postProblem
  * @description __URL__: /api/problems
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

const postProblem = async function(req, res, next) {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  // Add permission checks here
  const problem = new models.Problem(req.body.problem);
  if (req.body.problem.privacySetting === "E") {
    let title = req.body.problem.title;
    title = title.replace(/\s+/g, "");
    regex = new RegExp(title.split('').join('\\s*'), 'i');
    const exists = await models.Problem.find({ title: {$regex: regex } }).lean().exec();

    if (exists.length >= 1) {
      return utils.sendError.ValidationError('There is already an existing public problem with that title.', 'title', res);
    }
  }
  problem.createdBy = user;
  problem.createDate = Date.now();
  problem.save((err, doc) => {
    if (err) {
      console.error(`Error post problem: ${err}`);
      console.trace();
      return utils.sendError.InternalError(err, res);
    }
    const data = {'problem': doc};
    utils.sendResponse(res, data);
    next();
  });
};


/**
  * @public
  * @method putProblem
  * @description __URL__: /api/problems/:id
  * @description cannot make changes to the categories with putProblem
  *              use addCategory or removeCategory
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const putProblem = async function(req, res, next){
  try {
    const user = userAuth.requireUser(req);
    if (req.body.problem.privacySetting === "E") {
      let title = req.body.problem.title;
      title = title.replace(/\s+/g, "");
      regex = new RegExp(title.split('').join('\\s*'), 'i');
      const exists = await models.Problem.find({ title: {$regex: regex }, _id: {$ne: req.params.id} }).lean().exec();
      if (exists.length >= 1) {
        return utils.sendError.ValidationError('There is already an existing public problem with that title.', 'title', res);
      }
    }

    models.Problem.findById(req.params.id, (err, doc) => {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      // make the updates, but don't update categories or _id
      for(let field in req.body.problem) {
        if((field !== '_id') && (field !== undefined) && (field !== 'categories')) {
          doc[field] = req.body.problem[field];
        }
      }
      doc.save((err, problem) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        const data = {'problem': problem};
        utils.sendResponse(res, data);
      });
    });
  }catch(err) {
    console.error(`Error putProblem: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
};

/**
  * @public
  * @method addCategory
  * @description __URL__: /api/problems/addCategory/:id
  * @body {categoryId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const addCategory = (req, res, next) => {
  const user = userAuth.requireUser(req);
  models.Problem.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only add a category if it's new
    if (doc.categories.indexOf(req.body.categoryId) === -1){
      // doing a simple arr.push(id) was throwing an error because it was
      // invoking mongoose's deprectated $pushAll method. Using the
      // concat() method below uses $set and thus works.
      doc.categories = doc.categories.concat([req.body.categoryId]);
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'problem': problem};
      utils.sendResponse(res, data);
    });
  });
};

/**
  * @public
  * @method removeCategory
  * @description __URL__: /api/problems/removeCategory/:id
  * @body {categoryId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

const removeCategory = (req, res, next) => {
  const user = userAuth.requireUser(req);
  models.Problem.findById(req.params.id, (err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only attempt to remove if the category exists
    if (doc.categories.indexOf(req.body.categoryId) !== -1) {
      // remove category using the category Id
      doc.categories.splice(doc.categories.indexOf(req.body.categoryId), 1);
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'problem': problem};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.problems = getProblems;
module.exports.get.problem = getProblem;
module.exports.post.problem = postProblem;
module.exports.put.problem = putProblem;
module.exports.put.problem.addCategory = addCategory;
module.exports.put.problem.removeCategory = removeCategory;
/* jshint ignore:end */