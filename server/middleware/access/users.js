const utils = require('./utils');

module.exports.get = {};
const accessibleUsersQuery = async function(user, ids, usernames) {
  const accountType = user.accountType;
  const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in : ids};
  }

  if (usernames) {
    filter.username = { $in: usernames }
  }

  // students can only retrieve their own user record or
  // students from a section // or teachers?
  if (actingRole === 'student' || accountType === 'S') {
   const users = await utils.getStudentUsers;
  console.log('users', users);

  if (ids) {
    const intersection = _.intersection(ids, users);
    filter._id = {$in: intersection};
  } else {
    filter._id = { $in: users };
  }
    return filter;
  }
  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }

  if (accountType === 'P') {
    // can access all users from organization
    // can access all users who they created
   const users = await utils.getPdAdminUsers(user);

   if (ids) {
    const intersection = _.intersection(ids, users);
    filter._id = {$in: intersection};
   } else {
     filter._id = {$in: users}
   }
    return filter;
  }

  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    // const ownSections = utils.getTeacherSections(user);
    // // const ownAssignmentIds = await utils.getTeacherAssignments(user.id);

    // const ownAssignmentIds = await utils.getModelIds('Assignment', {createdBy: user._id});

    // filter.assignment = { $in: ownAssignmentIds };

    // filter.section = { $in: ownSections };
    const users = await utils.getTeacherUsers(user);

    if (ids) {
      const intersection = _.intersection(ids, users);
      filter._id = {$in: intersection};
     } else {
       filter._id = {$in: users}
     }
    return filter;
  }
};

module.exports.get.users = accessibleUsersQuery;