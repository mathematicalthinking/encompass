/* eslint complexity: 0 */
/**
  * # Problem API
  * @description This is the API for problem based requests
*/
/* jshint ignore:start */
//REQUIRE MODULES
const logger = require('log4js').getLogger('server');
const _ = require('underscore');


//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');
const apiUtils = require('../api/utils');
const access   = require('../../middleware/access/problems');
const accessUtils = require('../../middleware/access/utils');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

async function getOrgRecommendedProblems(user, orgIds, isIdOnly=true) {
  try {
    let orgs = await models.Organization.find({_id: {$in: orgIds}}).lean().exec();
    if (!orgs) {
      return [];
    }

    let problems = _.map(orgs, org => org.recommendedProblems);
    let filtered = _.filter(problems, problem => problem !== undefined && problem !== null);
    let flattened = _.flatten(filtered);

    if (isIdOnly) {
      return flattened;
    }
    return flattened;
  } catch(err) {
    console.error(`Error getOrgRecommendedProblems: `, err);
  }
}

async function getPowsProblems(criteria, isIdOnly) {
  try {
    let problems;
    if (isIdOnly) {
      problems = await models.Problem.find(criteria, {_id: 1}).lean().exec();
      return _.map(problems, p => p._id);
    }
    return await models.Problem.find(criteria).lean().exec();

  }catch(err) {
    console.error(`Error getPowsProblems: ${err}`);
  }
}

async function buildPowsFilterBy(pows) {
  let filter = {};
  let powIds;
  let criteria;

  if (pows === 'all') {
    criteria = {
      puzzleId: {
        $exists: true,
        $ne: null
      },
      isTrashed: false
    };
  }

  if (pows === 'none') {
    criteria = {
      puzzleId: null,
      isTrashed: false
    };
  } else if (pows === "privateOnly") {
     // exclude public pows
          criteria = {
            $and: [
              { puzzleId: { $exists: true, $ne: null } },
              { privacySetting: 'M'},
              { isTrashed: false}
            ]
          };

    } else if (pows === 'publicOnly') {
      criteria = {
        $and: [
          { puzzleId: { $exists: true, $ne: null } },
          { privacySetting: 'E'},
          { isTrashed: false}
        ]
      };

    }
    powIds = await getPowsProblems(criteria, true);

    if (!_.isEmpty(powIds)) {

      filter._id = { $in: powIds };
    }
    return filter;
}



async function buildProblemsFilter(user, hash) {
  try {
    const results = {
      hasNoData: false,
      invalidParams: false,
      criteria: null
    };
    // eslint-disable-next-line prefer-object-spread
    let filterBy = Object.assign({}, hash);

    filterBy.$and = [];

    if (!hash || _.isEmpty(hash)) {
      return results;
    }

    let { pows, all, categories, title } = hash;

    if (categories) {
        let cats = categories.ids;
        let includeSubCats = categories.includeSubCats;

        if (includeSubCats === 'true') {
          let catsWithChildren = await Promise.all(_.map(cats, (cat => {
            return accessUtils.getAllChildCategories(cat, true, true);
          })));

          let flattened = _.flatten(catsWithChildren);

          let uniqueCats = _.uniq(flattened);

          filterBy.$and.push({ categories: { $in: uniqueCats} });
        } else {
          filterBy.$and.push({categories : {$in: cats} });
        }
        delete filterBy.categories;
      }

      if (pows) {
        filterBy.$and.push(await buildPowsFilterBy(pows));

        delete filterBy.pows;

      } else if (all) {
        let { org } = all;
        if (org) {
          let crit = {};
          let { recommended, organizations } = org;

          let recommendedProblems;
          if (recommended) {
            recommendedProblems = await getOrgRecommendedProblems(user, recommended , true);
          }

          if (!_.isEmpty(recommendedProblems)) {
            if (!crit.$or) {
              crit.$or = [];
            }
            crit.$or.push({_id: {$in: recommendedProblems}});

         }
         if (organizations) {
          if (!crit.$or) {
            crit.$or = [];
          }
           crit.$or.push({organization: {$in: organizations}});
         }

         if (_.isEmpty(recommendedProblems) && !organizations) {
          results.hasNoData = true;
          return results;
         }
         filterBy.$and.push(crit);
         delete filterBy.all;
        }
      } else if (title) {
        let replaced = title.replace(/\s+/g, "");
        let regex = new RegExp(replaced, 'i');
        filterBy.$and.push({ title : regex });

        delete filterBy.title;
      }
      if (_.isEmpty(filterBy.$and)) {
        delete filterBy.$and;
      }
      results.criteria = filterBy;

      return results;
  }catch(err) {
    console.log(`Error buildProblemsFilter: ${err}`);
  }
}

  async function buildProblemsSearch(hash) {
    const results = {
      hasNoData: false,
      invalidParams: false,
      criteria: null
    };


    if (!hash) {
      return results;
    }

    let { query, criterion } = hash;

    if (query && !criterion) {
      criterion = 'general';
    }

    if (!query && !criterion) {
      return results;
    }
    let searchFilter;

    if (criterion === 'general') {
      let topLevelStringProps = ['title'];

      searchFilter = {};

      query = query.replace(/\s+/g, "");

      let regex = new RegExp(query.split('').join('\\s*'), 'i');

      searchFilter.$or = [];

      for (let prop of topLevelStringProps) {
        searchFilter.$or.push({[prop]: regex});
      }

      let queries = [
        {$text: {$search: query}},
        searchFilter
      ];
      let uniqueIds = await apiUtils.getUniqueIdsFromQueries('Problem', queries);

      if (_.isEmpty(uniqueIds)) {
        searchFilter = {};
      } else {
        searchFilter = { _id: { $in: uniqueIds } };
      }
    }  else {
      query = query.replace(/\s+/g, "");
      let regex = new RegExp(query.split('').join('\\s*'), 'i');

      searchFilter = {[criterion]: regex};
    }
    results.criteria = searchFilter;
    return results;

  }

async function buildProblemsCriteria(user, queryParams, isTrashedOnly) {
  try {
    let { ids, filterBy, searchBy} = queryParams;

    let [ filter, search ] = await Promise.all([buildProblemsFilter(user, filterBy), buildProblemsSearch(searchBy)]);

    if (filter.hasNoData || search.hasNoData) {
      // return immediately;
      return null;
    }
    if (filter.invalidParams || search.invalidParams) {
      return null;
    }

    return access.get.problems(user, ids, filter.criteria, search.criteria, isTrashedOnly);

  }catch(err) {
    console.error(`Error buildProblemsCriteria: ${err}`);
  }
}

/**
  * @public
  * @method getProblems
  * @description __URL__: /api/problems
  * @returns {Object} An array of problem objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

// query params support:
// ids
// filterBy
// sortBy

const getProblems = async function(req, res, next) {
  let isTrashedOnly;
  try {
    const user = userAuth.requireUser(req);
    if (!user) {
      return utils.sendError.InvalidCredentialsError(null, res);
    }
    if (req.query.isTrashedOnly === 'true') {
      if (user.accountType === 'A') {
        isTrashedOnly = true;
      } else {
        return utils.sendError.InvalidCredentialsError('Not Admin', res);
      }
    }

  const criteria = await buildProblemsCriteria(user, req.query, isTrashedOnly);

  if (_.isNull(criteria)) {
    return utils.sendResponse(res, null);
  }
    let { sortBy, page } = req.query;

    let sortParam = {title: 1};
    let doCollate = true;
    let byRelevance = false;

    if (sortBy) {
      sortParam = sortBy.sortParam;
      doCollate = sortBy.doCollate;
      byRelevance = sortBy.byRelevance;
    }

    let results, itemCount;

    if (byRelevance) {
      [ results, itemCount ] = await Promise.all([
        models.Problem.find(criteria, { score: {$meta: "textScore"}}).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
        models.Problem.count(criteria)
      ]);
    } else if (doCollate) {
       [ results, itemCount ] = await Promise.all([
        models.Problem.find(criteria).collation({locale: 'en', strength: 1}).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
        models.Problem.count(criteria)
      ]);
    } else {
      [ results, itemCount ] = await Promise.all([
        models.Problem.find(criteria).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
        models.Problem.count(criteria)
      ]);
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
    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getProblems: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
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

const getProblem = async function(req, res, next) {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
  }

  let id = req.params.id;

  let problem = await models.Problem.findById(id);

  // record not found in db or is trashed
  if (!problem) {
    return utils.sendResponse(res, null);
  }

  // user has permission; send back record
  const data = {
    problem
  };

  if (problem.isTrashed) {
    if (user.accountType === 'A') {
      return utils.sendResponse(res, data);
    } else {
      return utils.sendResponse(res, null);
    }
  }

  let canLoadProblem = await access.get.problem(user, id);

  // user does not have permission to access problem
  if (!canLoadProblem) {
    return utils.sendError.NotAuthorizedError('You do not have permission.', res);
  }

  return utils.sendResponse(res, data);
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
    let isTitleUnique = await apiUtils.isRecordUniqueByStringProp('Problem', req.body.problem.title, 'title', {privacySetting: 'E'});

    if (!isTitleUnique) {
      return utils.sendError.ValidationError(`There is already an existing public problem titled "${req.body.problem.title}."`, 'title', res);
    }
  }
  problem.createdBy = user;
  problem.createDate = Date.now();
  problem.save((err, doc) => {
    if (err) {
      console.error(`Error post problem: ${err}`);
      console.trace();
      return utils.sendError.InternalError(null, res);
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

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    if (req.body.problem.privacySetting === "E") {
      let isTitleUnique = await apiUtils.isRecordUniqueByStringProp('Problem', req.body.problem.title, 'title', {privacySetting: 'E', _id: {$ne: req.params.id} });

      if (!isTitleUnique) {
        return utils.sendError.ValidationError(`There is already an existing public problem titled "${req.body.problem.title}."`, 'title', res);
      }
    }

    models.Problem.findById(req.params.id, (err, doc) => {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(null, res);
      }
      // make the updates, but don't update categories or _id
      for(let field in req.body.problem) {
        if((field !== '_id') && (field !== undefined)) {
          doc[field] = req.body.problem[field];
        }
      }
      doc.save((err, problem) => {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(null, res);
        }
        const data = {'problem': problem};
        utils.sendResponse(res, data);
      });
    });
  }catch(err) {
    console.error(`Error putProblem: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
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

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Problem.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(null, res);
    }
    // only add a category if it's new
    if (doc.categories.indexOf(req.body.categoryId) === -1){
      // doing a simple arr.push(id) was throwing anullor because it was
      // invoking mongoose's deprectated $pushAll method. Using the
      // concat() method below uses $set and thus works.
      doc.categories = doc.categories.concat([req.body.categoryId]);
    }
    doc.save((err, problem) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(null, res);
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

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Problem.findById(req.params.id, (err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(null, res);
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