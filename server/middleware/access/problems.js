const utils = require('./utils');
module.exports.get = {};

async function getStudentProblems(user) {
  const assignments = await models.Assignment.find({'_id': {$in: user.assignments}});

  return assignments.map(assn => assn.problem);

}


const accessibleProblemsQuery = async function(user, ids) {
  try {
    if (!user) {
      return [];
    }
    const accountType = user.accountType;
    const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

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

module.exports.get.problems = accessibleProblemsQuery;