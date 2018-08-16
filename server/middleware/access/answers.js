const utils = require('./utils');
module.exports.get = {};

const accessibleAnswersQuery = async function(user, ids) {
  const accountType = user.accountType;
  const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in : ids};
  }

  if (actingRole === 'student' || accountType === 'S') {
    filter.createdBy = user.id;
    return filter;
  }
  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }

  if (accountType === 'P') {
    // only answers tied to organization
    //get users from org and then ch
    const userOrg = user.organization;
    const userIds = await utils.getModelIds('Organization', {_id: userOrg});

    filter.createdBy = {$in : userIds};
    return filter;
  }

  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    const ownSections = utils.getTeacherSections(user);
    // const ownAssignmentIds = await utils.getTeacherAssignments(user.id);

    const ownAssignmentIds = await utils.getModelIds('Assignment', {createdBy: user._id});

    filter.assignment = { $in: ownAssignmentIds };

    filter.section = { $in: ownSections };
    return filter;
  }
};

module.exports.get.answers = accessibleAnswersQuery;