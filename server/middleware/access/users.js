/* eslint-disable complexity */
const _ = require('underscore');

const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');
const models = require('../../datasource/schemas');
const problemsAccess = require('./problems');
const apiUtils = require('../../datasource/api/utils');

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
const accessibleUsersQuery = async function(user, ids, usernames, regex, filterBy) {
  if (!apiUtils.isNonEmptyObject(user)) {
    return;
  }
  try {
    const { accountType, actingRole } = user;

    let isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      isTrashed: false
    };

  // ids will either be an array of ids or a single id or null
  if (ids) {
    if (apiUtils.isNonEmptyArray(ids)) {
      filter._id = { $in: ids };
    } else if (apiUtils.isValidMongoId(ids)) {
      filter._id = ids;
    }
  }
  if (usernames) {
    if (apiUtils.isNonEmptyArray(usernames)) {
      filter.username = { $in: usernames };
    } else if (_.isString(usernames)) {
      filter.username = usernames;
    }
  }

  if (regex) {
    filter.username = regex;
  }

  if (apiUtils.isNonEmptyObject(filterBy)) {
    let { accountType } = filterBy;
    if (_.contains(['S', 'T', 'P', 'A'], accountType)) {
      filter.accountType = accountType;
    }
  }
  // Admins not in acting student role can access all users
  if (accountType === 'A' && !isStudent) {
    return filter;
  }

  if (!filter.$or) {
    filter.$or = [];
  }
  // all users can access themselves, users they created, and the user who created them(?)

  filter.$or.push({ _id: user._id });
  filter.$or.push({ createdBy: user._id });

  if (apiUtils.isValidMongoId(user.createdBy)) {
    filter.$or.push({ _id: user.createdBy });
  }

  // all users need to be able to access users from any workspace they have access to

  if (isStudent) {
    let [ workspaceUsers, studentUsers, responseUsers ] = await Promise.all([
      utils.getUsersFromWorkspaces(user), utils.getStudentUsers(user), utils.getResponseUsers(user)
    ]);

    if (apiUtils.isNonEmptyArray(workspaceUsers)) {
      filter.$or.push({ _id: {$in: workspaceUsers } });
    }

    if (apiUtils.isNonEmptyArray(studentUsers)) {
      filter.$or.push({ _id: {$in: studentUsers } });
    }

    if (apiUtils.isNonEmptyArray(responseUsers)) {
      filter.$or.push({ _id: {$in: responseUsers } });
    }

    return filter;
  }

  if (accountType === 'P') {
    let [ workspaceUsers, pdUsers, responseUsers ] = await Promise.all([
      utils.getUsersFromWorkspaces(user), utils.getPdAdminUsers(user), utils.getResponseUsers(user)
    ]);

    if (apiUtils.isNonEmptyArray(workspaceUsers)) {
      filter.$or.push({ _id: {$in: workspaceUsers } });
    }

    if (apiUtils.isNonEmptyArray(pdUsers)) {
      filter.$or.push({ _id: {$in: pdUsers } });
    }

    if (apiUtils.isNonEmptyArray(responseUsers)) {
      filter.$or.push({ _id: {$in: responseUsers } });
    }

    return filter;
  }

  if (accountType === 'T') {
    let [ workspaceUsers, teacherUsers, responseUsers ] = await Promise.all([
      utils.getUsersFromWorkspaces(user), utils.getTeacherUsers(user), utils.getResponseUsers(user)
    ]);
    if (apiUtils.isNonEmptyArray(workspaceUsers)) {
      filter.$or.push({ _id: {$in: workspaceUsers } });
    }

    if (apiUtils.isNonEmptyArray(teacherUsers)) {
      filter.$or.push({ _id: {$in: teacherUsers } });
    }

    if (apiUtils.isNonEmptyArray(responseUsers)) {
      filter.$or.push({ _id: {$in: responseUsers } });
    }

    return filter;
  }
  }catch(err) {
    console.error(`Error accessibleUsersQuery: ${err}`);
    console.trace();
  }

};

const canGetUser = async function(user, id, username) {
  let isValidId = apiUtils.isValidMongoId(id);
  let isValidUserName = apiUtils.isNonEmptyString(username);

  if (!isValidId && !isValidUserName) {
    return;
  }

  if (!apiUtils.isNonEmptyObject(user)) {
    return;
  }

  let { accountType, actingRole } = user;

  let isStudent = accountType === 'S' || actingRole === 'student';


  let criteria;
  let requestedUser;

  if (id) {
    requestedUser = await models.User.findById(id).lean().exec();
  } else {
    requestedUser = await models.User.findOne({username: username}).lean().exec();
  }

  if (!requestedUser || !requestedUser._id || requestedUser.isTrashed) {
    return {
      doesExist: false,
      hasPermission: null
    };
  }

  if (accountType === 'A' && !isStudent) {
    return {
      doesExist: true,
      hasPermission: true,
      requestedUser
    };
  }

  let isAdmin = accountType === 'A' && !isStudent;
  let isPdAdmin = accountType === 'P' && !isStudent;
  let isTeacher = accountType === 'T' && !isStudent;

  let isOrgUser = (isPdAdmin || isTeacher) && mongooseUtils.areObjectIdsEqual(requestedUser.organization, user.organization);
  let isOwnSelf = mongooseUtils.areObjectIdsEqual(requestedUser._id, user._id);
  let isOwnCreator = mongooseUtils.areObjectIdsEqual(requestedUser.createdBy, user._id);

  if (isAdmin || isOrgUser || isOwnSelf || isOwnCreator) {
    return {
      doesExist: true,
      hasPermission: true,
      requestedUser
    };
  }

  if (id) {
    criteria = await accessibleUsersQuery(user, id, null);
  } else {
    criteria = await accessibleUsersQuery(user, null, username);
  }

  if ( await models.User.findOne(criteria) !== null) {
    return {
      doesExist: true,
      hasPermission: true,
      requestedUser
    };
  }

  let isAccessibleCreator;
  let userCreatorIds = [];
  let problemCreatorIds = [];


  // should this be necessary?

  // check if requested user is creator of an accessible user

  let userCrit = await accessibleUsersQuery(user);

  userCreatorIds = await utils.getCreatorIds('User', userCrit);

  isAccessibleCreator = _.find(userCreatorIds, (creatorId) => {
    return mongooseUtils.areObjectIdsEqual(creatorId, requestedUser._id);
  }) !== undefined;

  if (isAccessibleCreator) {
    return {
      doesExist: true,
      hasPermission: true,
      requestedUser
    };
  }

  //check if requsted user is creator of an accessibile problem

  let problemCrit = await problemsAccess.get.problems(user);
  problemCreatorIds = await utils.getCreatorIds('Problem', problemCrit);

  isAccessibleCreator = _.find(problemCreatorIds, (creatorId) => {
    return mongooseUtils.areObjectIdsEqual(creatorId, requestedUser._id);
  }) !== undefined;

  if (isAccessibleCreator) {
    return {
      doesExist: true,
      hasPermission: true,
      requestedUser
    };
  }

  // exhausted checks, cannot access;
  return {
    doesExist: true,
    hasPermission: false,
    requestedUser: null
  };
};

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

const canModifyUser = async function(user, userIdToModify) {
  if (!apiUtils.isNonEmptyObject(user)) {
    return false;
  }
  const { id, accountType, actingRole } = user;

  const isStudent = accountType === 'S' || actingRole === 'student';

  // admins can always modify any user
  if (accountType === 'A' && !isStudent) {
    return true;
  }

  // can always modify self
  if (_.isEqual(id, userIdToModify)) {
    return true;
  }
  const criteria = await modifiableUserCriteria(user);
  const modifiableUsers = await models.User.find(criteria, {_id: 1}).lean().exec();
  const userIds = modifiableUsers.map(obj => obj._id.toString());

  return _.contains(userIds, userIdToModify);

};


// const userConstraints = {
//   createdBy: {
//     format: {
//       pattern: "^[0-9a-fA-F]{24}$",
//       message: "must be valid ObjectId"
//     }
//   },
//   _id: {
//     format: {
//       pattern: "^[0-9a-fA-F]{24}$",
//       message: "must be valid ObjectId"
//     }
//   },
//   lastModifiedBy: {
//     format: {
//       pattern: "^[0-9a-fA-F]{24}$",
//       message: "must be valid ObjectId"
//     }
//   }
// };

// const parseUserPutRequestBody = function(user, body) {
//   const results = {
//     updateHash: {},
//     errors: []
//   };


//   if (!apiUtils.isNonEmptyObject(user)) {
//     results.errors.push('Invalid user');
//     return results;
//   }
//   if (!apiUtils.isNonEmptyObject(body)) {
//     results.errors.push('Invalid Put Request body');
//     return results;
//   }

//   // uneditable
//   delete body.username;
//   delete body.createDate;
//   delete body.key;

//   const { accountType, actingRole } = user;

//   results.updateHash.seenTour = body.seenTour;
//   // does everyone need to be able to update lastModifiedBy?
//   results.updateHash.lastModifiedBy = body.lastModifiedBy;
//   results.updateHash.lastModifiedDate = body.lastModifiedDate;

//   // student accounts can currently only update their own seenTour
//   if (accountType === 'S') {
//     return results;
//   }

//   // actingRole student can only update seenTour and actingRole
//   if (actingRole === 'S') {
//     results.updateHash.actingRole = body.actingRole;
//     return results;
//   }

// };

module.exports.get.users = accessibleUsersQuery;
module.exports.get.user = canGetUser;
module.exports.put.user = modifiableUserCriteria;
module.exports.canModifyUser = canModifyUser;