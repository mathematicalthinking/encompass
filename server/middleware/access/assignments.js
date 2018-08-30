const utils = require('./utils');
module.exports.get = {};

async function accessibleAssignments(user) {
  if (!user) {
    return;
  }
  const accountType = user.accountType;
  const actingRole = user.actingRole;
  let filter = {
    isTrashed: false
  };

  if (accountType === 'S' || actingRole === 'student') {
    filter.students = user;
    return filter;
  }

  if (accountType === 'T') {
    const sections = await utils.getTeacherSections(user);
    filter.$or = [
      { createdBy: user },
      { section: { $in: sections } }
    ];
    return filter;
  }

  if (accountType === 'P') {
    const sections = await utils.getOrgSections(user);
    filter.$or = [
      { createdBy: user },
      { section: { $in: sections} }
    ];

    return filter;
  }

  if (accountType === 'A') {
    return filter;
  }
}

module.exports.get.assignments = accessibleAssignments;