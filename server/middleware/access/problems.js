const utils = require('./utils');
const models = require('../../datasource/schemas');
const _ = require('underscore');

module.exports.get = {};

async function getStudentProblems(user) {
  const assignments = await models.Assignment.find({'_id': {$in: user.assignments}});

  return assignments.map(assn => assn.problem);

}


const accessibleProblemsQuery = async function(user, ids, filterBy, searchBy) {
  try {
    if (!user) {
      return [];
    }
    let filter = {
      $and: []
    };

    const accountType = user.accountType;
    const actingRole = user.actingRole;

    filter.$and.push({isTrashed: false});

  if (ids) {
    filter.$and.push({_id: {$in : ids } });
  }
  if (!_.isEmpty(filterBy)) {
    let filterByCrit = {$or: []};

    for (let field of Object.keys(filterBy)) {
      if (field === 'privacySetting') {
        filterByCrit.$or.push({privacySetting: {$in: filterBy[field]}});
      } else {
        filterByCrit.$or.push({[field]: filterBy[field]});
      }
    }
    filter.$and.push(filterByCrit);
  }

  if (searchBy) {
    console.log('searchBy', searchBy);
    filter.$and.push(searchBy);
  }

  let accessCrit = {$or: []};

  if (actingRole === 'student' || accountType === 'S') {
    const studentProblems = await getStudentProblems(user);
      accessCrit.$or.push({ privacySetting: "E" });
      accessCrit.$or.push({ $and: [{ organization: user.organization },{ privacySetting: "O" }]});
      accessCrit.$or.push({_id: { $in: studentProblems } });
    filter.$and.push(accessCrit);
    return filter;
  }

  // Admins with acting role 'teacher' can get everything
  if (accountType === 'A') {
    return filter;
  }

  if (accountType === 'P') {
    const problems = await utils.getAssignmentProblems(user);
      accessCrit.$or.push({ privacySetting: "E" });
      accessCrit.$or.push({ createdBy: user._id });
      if (!_.isEmpty(problems)) {
        accessCrit.$or.push({ _id: { $in: problems }});
      }

      accessCrit.$or.push({ organization: user.organization });

      filter.$and.push(accessCrit);
    return filter;
  }

  if (accountType === 'T') {
    const problems = await utils.getAssignmentProblems(user);

      accessCrit.$or.push({ privacySetting: "E" });
      accessCrit.$or.push({ createdBy: user._id });
      if (!_.isEmpty(problems)) {
        accessCrit.$or.push({ _id: { $in: problems }});
      }

      accessCrit.$or.push({ $and: [{ organization: user.organization }, { privacySetting: "O" }]});

      filter.$and.push(accessCrit);
      return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};
const canGetProblem = async function(user, problemId) {
  if (!user) {
    return;
  }

  const { accountType } = user;

  // admins currently can get all problems
  if (accountType === 'A') {
    return true;
  }

  // use accessibleProblems criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleProblemsQuery(user, problemId);
  let accessibleIds = await utils.getModelIds('Problem', criteria);

  // map objectIds to strings to check for existence
  accessibleIds = accessibleIds.map(id => id.toString());

    if (accessibleIds.includes(problemId)) {
      return true;
    }
    return false;
};


module.exports.get.problems = accessibleProblemsQuery;
module.exports.get.problem = canGetProblem;