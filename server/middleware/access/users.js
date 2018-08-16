const utils = require('./utils');
const _ = require('underscore');

module.exports.get = {};


/**
  * @private
  * @method accessibleUsersQuery
  * @description
  * @see [utils](..././utils.js)
  * @returns {Object} A filter object that can be passed to a Mongoose find operation
  *
  */
const accessibleUsersQuery = async function(user, ids, usernames, username) {
  if (!user) {
    return;
  }
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

  if (username) {
    filter.username = { username }
  }

  // students can only retrieve their own user record or
  // students from a section // or teachers?
  if (actingRole === 'student' || accountType === 'S') {
   const users = await utils.getStudentUsers(user);

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