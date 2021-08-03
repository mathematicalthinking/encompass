const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');
const objectUtils = require('../../utils/objects');
const { isNonEmptyArray, isNonEmptyObject } = objectUtils;

module.exports.get = {};

const accessibleProblemsQuery = async function(user, ids, filterBy, searchBy, isTrashedOnly=false) {
  try {
    if (!isNonEmptyObject(user)) {
      return;
    }
    if (isTrashedOnly) {
      return { isTrashed: true };
    }
    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };

    let { accountType, actingRole } = user;
    let isStudent = accountType === 'S' || actingRole === 'student';

  if (isNonEmptyArray(ids)) {
    filter.$and.push({ _id: { $in : ids } });
  } else if(mongooseUtils.isValidMongoId(ids)) {
    filter.$and.push({ _id: ids });
  }
  if (isNonEmptyObject(filterBy)) {
    filter.$and.push(filterBy);
  }

  if (searchBy) {
    filter.$and.push(searchBy);
  }
  // Admins with acting role 'teacher' can get everything


  if (accountType === 'A' && !isStudent) {
    return filter;
  }

  let [ assignmentProblems, workspaceProblems, recommendedProblems ] = await Promise.all([
    utils.getAssignmentProblems(user),
    utils.getWorkspaceProblemIds(user),
    utils.getOrgRecommendedProblems(user)
  ]);

  let accessCrit = {
    $or: [
      { privacySetting: "E" },
      { createdBy: user._id }
    ]
  };

  [ assignmentProblems, workspaceProblems, recommendedProblems ].forEach((list) => {
    if (isNonEmptyArray(list)) {
      accessCrit.$or.push({_id: {$in: list}});
    }
  });

  if (accountType === 'P') {
    accessCrit.$or.push({ organization: user.organization });

    filter.$and.push(accessCrit);
    return filter;
  }

  // block flagged problems for non admins / pdadmins?
  filter.$and.push({ status: { $ne: 'flagged' } });


  if (actingRole === 'student' || accountType === 'S') {
    accessCrit.$or.push({ $and: [{ organization: user.organization },{ privacySetting: "O" }]});

    filter.$and.push(accessCrit);

    return filter;
  }

  if (accountType === 'T') {
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

  const { accountType, actingRole } = user;

  // admins currently can get all problems
  if (accountType === 'A' && actingRole !== 'student') {
    return true;
  }

  // use accessibleProblems criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleProblemsQuery(user, problemId);
  return utils.doesRecordExist('Problem', criteria);
};


module.exports.get.problems = accessibleProblemsQuery;
module.exports.get.problem = canGetProblem;