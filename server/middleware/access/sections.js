const utils = require('./utils');
module.exports.get = {};

const accessibleSectionsQuery = function(user, ids) {
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
  // Students can get sections they are a student of
  if (actingRole === 'student' || accountType === 'S') {
    filter.students = user._id;

    return filter;
  }

  // Admins with acting role 'teacher' can get everything
  if (accountType === 'A') {
    return filter;
  }
  // PdAdmins with acting role 'teacher' can get all sections tied to their org
  if (accountType === 'P') {
    const userOrg = user.organization;
    if (userOrg) {
      filter.organization = userOrg;
    }

    return filter;
  }
  // Teachers with acting role 'teacher' can get all sections where they are a teacher
  if (accountType === 'T') {

    filter.teachers = user._id;
    return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};

module.exports.get.sections = accessibleSectionsQuery;