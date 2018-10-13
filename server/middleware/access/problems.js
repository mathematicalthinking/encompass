const utils = require('./utils');
const models = require('../../datasource/schemas');

module.exports.get = {};

async function getStudentProblems(user) {
  const assignments = await models.Assignment.find({'_id': {$in: user.assignments}});

  return assignments.map(assn => assn.problem);

}


const accessibleProblemsQuery = async function(user, ids, filterBy) {
  try {
    if (!user) {
      return [];
    }

    console.log('filterBy apq', filterBy);
    const accountType = user.accountType;
    const actingRole = user.actingRole;

    let filter = {
    isTrashed: false
  };
  if (filterBy) {

    for (let key of Object.keys(filterBy)) {
      if (key === 'privacySetting') {
        filter[key] = {$in: filterBy[key]};
      } else {
        filter[key] = filterBy[key];
      }

    }
  }

  if (ids) {
    filter._id = {$in : ids};
  }

  if (actingRole === 'student' || accountType === 'S') {
    const studentProblems = await getStudentProblems(user);
      filter.$or = [
        { privacySetting: "E" },
        { $and: [
          { organization: user.organization },
          { privacySetting: "O" }
        ]},
        {_id: { $in: studentProblems } },
      ];

    return filter;
  }

  // Admins with acting role 'teacher' can get everything
  if (accountType === 'A') {
    return filter;
  }

  if (accountType === 'P') {
    const problems = await utils.getAssignmentProblems(user);
    filter.$or = [
      { privacySetting: "E" },
      { createdBy: user },
      { _id: { $in: problems }},
      { organization: user.organization }
    ];

    return filter;
  }

  if (accountType === 'T') {
    const problems = await utils.getAssignmentProblems(user);
    filter.$or = [
      { privacySetting: "E" },
      { createdBy: user },
      { _id: { $in: problems }},
      { $and: [
        { organization: user.organization },
        { privacySetting: "O" }
      ]},
    ];

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