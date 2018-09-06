const _ = require('underscore');

const utils = require('./utils');
const models = require('../../datasource/schemas');

module.exports.get = {};
module.exports.put = {};


/**
  * @private
  * @method accessibleUsersQuery
  * @description
  * @see [utils](..././utils.js)
  * @returns {Object} A filter object that can be passed to a Mongoose find operation
  *
  */
const accessibleUsersQuery = async function(user, ids, usernames, regex) {
  if (!user) {
    return;
  }
  try {
    const accountType = user.accountType;
    const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

  if (ids) {
    //filter.$or.push({_id: { $in: ids }});
    filter._id = {$in : ids};
  }

  if (usernames) {
    //filter.$or.push({username: { $in: usernames }});
    filter.username = { $in: usernames }
  }

  if (regex) {
    //filter.$or.push({username: regex});
    filter.username = regex;
  }

  // students can only retrieve their own user record or
  // students from a section // or teachers?
  if (actingRole === 'student' || accountType === 'S') {
   const users = await utils.getStudentUsers(user);

  // if (ids) {
  //   const intersection = _.intersection(ids, users);
  //   filter._id = {$in: intersection};
  // } else {
  //   filter._id = { $in: users };
  // }
  filter.$or = [];
  filter.$or.push({ _id: {$in: users } });

  return filter;
  }

  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }

  const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);

  const usersFromWs = await utils.getUsersFromWorkspaces(accessibleWorkspaceIds);
  filter.$or = [];
  filter.$or.push({ _id: {$in: usersFromWs } });

    let intersection;
    let union;


  if (accountType === 'P') {
    // can access all users from organization
    // can access all users who they created
    const users = await utils.getPdAdminUsers(user);
    // get unique user list from workspace users and users from org
    // union = _.union(users, usersFromWs);

  //  if (ids) {
  //   // user_id needs to be in both the query ids and the union list
  //   intersection = _.intersection(ids, union);
  //   filter._id = {$in: intersection};
  //  } else {
  //   filter._id = {$in: union}
  //  }
  filter.$or = [];
  filter.$or.push({ _id: {$in: users } });

  return filter;
  }

  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    const users = await utils.getTeacherUsers(user);
    filter.$or = [];
    filter.$or.push({ _id: {$in: users } });

    // union = _.union(users, usersFromWs);

    // if (ids) {
    // intersection = _.intersection(ids, union);
    // filter._id = {$in: intersection};
    //  } else {
    //   filter._id = {$in: union}
    //  }
    return filter;
  }
  }catch(err) {
    console.log('err auq', err);
  }

};

const canGetUser = async function(user, id, username) {
  if (!id && !username) {
    return;
  }

  let criteria;
  let requestedUser;
  let accessibleUserIds;

  if (id) {
    requestedUser = await models.User.findById(id).lean().exec();
  } else {
    requestedUser = await models.User.findOne({username: username}).lean().exec();
  }

  if (!requestedUser || !requestedUser._id) {
    return {
      doesExist: false,
      hasPermission: null
    };
  }
  if (id) {
    criteria = await accessibleUsersQuery(user, [id], null);
    console.log('crit', JSON.stringify(criteria));
  } else {
    criteria = await accessibleUsersQuery(user, null, [username]);
  }
  accessibleUserIds = await utils.getModelIds('User', criteria);
  accessibleUserIds = accessibleUserIds.map(obj => obj.toString());

  console.log('accessibleUserIds', accessibleUserIds);
  if (_.contains(accessibleUserIds, requestedUser._id.toString())) {
    return({
      doesExist: true,
      hasPermission: true,
      requestedUser: requestedUser
    });
  }
  return {
    doesExist: true,
    hasPermission: false,
    requestedUser: null
  };
}

const modifiableUserCriteria = function(user) {
  if (!user) {
    return;
  }
  const accountType = user.accountType;
  const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };
  // students can only modify their own account
  if (accountType === 'S' || actingRole === 'student') {
    filter._id = user._id;
    return filter;
  }

  if (accountType === 'A') {
    return filter;
  }

  // pdAdmins can modify anyone in their organization
  if (accountType === 'P') {
    filter.organization = user.organization;
    return filter;
  }
  // teachers can only modify themselves or students
  // for now let teachers modify any students from their org
  if (accountType === 'T') {
    filter.$or = [
      { _id: user._id },
      { $and: [
        { organization: user.organization },
        // { accountType: 'S' }
      ]}

    ];
    return filter;
  }
};

module.exports.get.users = accessibleUsersQuery;
module.exports.get.user = canGetUser;
module.exports.put.user = modifiableUserCriteria;