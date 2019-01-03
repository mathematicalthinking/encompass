const _ = require('underscore');

const utils = require('./utils');
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
  if (!user) {
    return;
  }
  try {
    const accountType = user.accountType;
    const actingRole = user.actingRole;

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
    filter.username = { $in: usernames };
  }

  if (regex) {
    filter.username = regex;
  }

  if (filterBy) {
    let { accountType } = filterBy;
    filter.accountType = accountType;
  }

  // students can only retrieve their own user record or
  // students from a section // or teachers?
  if (actingRole === 'student' || accountType === 'S') {

    const users = await utils.getStudentUsers(user);

    if (!filter.$or) {
      filter.$or = [];
    }
    filter.$or.push({ _id: user.createdBy });
    filter.$or.push({ _id: {$in: users } });

    return filter;
  }

  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }

  const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);

  const usersFromWs = await utils.getUsersFromWorkspaces(accessibleWorkspaceIds);

  if (!filter.$or) {
    filter.$or = [];
  }

  filter.$or.push({ _id: {$in: usersFromWs } });
  filter.$or.push({ _id: user.createdBy });

  if (accountType === 'P') {
    const users = await utils.getPdAdminUsers(user);
    if (!_.isEmpty(users)) {
      filter.$or.push({ _id: {$in: users } });
    }

    return filter;
  }

  if (accountType === 'T') {
    const users = await utils.getTeacherUsers(user);
    filter.$or.push({ _id: {$in: users } });
    return filter;
  }
  }catch(err) {
    console.error(`Error accessibleUsersQuery: ${err}`);
    console.trace();
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

  if (!requestedUser || !requestedUser._id || requestedUser.isTrashed) {
    return {
      doesExist: false,
      hasPermission: null
    };
  }


  if (id) {
    criteria = await accessibleUsersQuery(user, [id], null);
  } else {
    criteria = await accessibleUsersQuery(user, null, [username]);
  }
  accessibleUserIds = await utils.getModelIds('User', criteria);

  if (!_.isEmpty(accessibleUserIds)) {
    accessibleUserIds = accessibleUserIds.map(obj => obj.toString());
  }
  let isAccessibleCreator;
  let userCreators = [];
  let problemCreators = [];

  if (id && _.isEmpty(accessibleUserIds)) {
    // check if requested user is creator
    let crit = await accessibleUsersQuery(user);

    userCreators = await utils.getCreatorIds('User', crit);
    isAccessibleCreator = _.contains(userCreators, id);

    if (!isAccessibleCreator) {
      //check if requsted user is creator of an accessible problem
      let problemCrit = await problemsAccess.get.problems(user);
      problemCreators = await utils.getCreatorIds('Problem', problemCrit);
      isAccessibleCreator = _.contains(problemCreators, id);
    }
  }


  let hasPermission = _.contains(accessibleUserIds, requestedUser._id.toString()) || isAccessibleCreator;

  if (hasPermission) {
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