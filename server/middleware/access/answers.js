const utils = require('./utils');
module.exports.get = {};

const accessibleAnswersQuery = async function(user, ids) {
  try {
    const accountType = user.accountType;
    const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in : ids};
  }
  // Students can only get answers they've created
  if (actingRole === 'student' || accountType === 'S') {
    filter.createdBy = user.id;
    return filter;
  }

  // Admins with acting role 'teacher' can get everything
  if (accountType === 'A') {
    return filter;
  }
  // PdAdmins with acting role 'teacher' can get all answers tied to their org
  if (accountType === 'P') {
    const userOrg = user.organization;
    const userIds = await utils.getModelIds('User', {organization: userOrg});
    console.log(`List of users from org ${userOrg} in auq: ${userIds}`);
    filter.createdBy = {$in : userIds};
    return filter;
  }
  // Teachers with acting role 'teacher' can get all answers tied to their assignments or sections
  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    const ownSections = await utils.getTeacherSections(user);

    const ownAssignmentIds = await utils.getModelIds('Assignment', {createdBy: user._id});

    filter.assignment = { $in: ownAssignmentIds };

    filter.section = { $in: ownSections };
    return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};

module.exports.get.answers = accessibleAnswersQuery;