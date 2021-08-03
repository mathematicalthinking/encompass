/* eslint-disable complexity */
const _ = require('underscore');

const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');
const models = require('../../datasource/schemas');
const problemsAccess = require('./problems');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, isNonEmptyString, } = objectUtils;
const { isValidMongoId, areObjectIdsEqual } = mongooseUtils;

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
const accessibleUsersQuery = async function(user, ids, usernames, regex, filterBy, exactRegex) {
  if (!isNonEmptyObject(user)) {
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
    if (isNonEmptyArray(ids)) {
      filter._id = { $in: ids };
    } else if (mongooseUtils.isValidMongoId(ids)) {
      filter._id = ids;
    }
  }
  if (usernames) {
    if (isNonEmptyArray(usernames)) {
      filter.username = { $in: usernames };
    } else if (_.isString(usernames)) {
      filter.username = usernames.toLowerCase();
    }
  }

  if (regex) {
    filter.username = regex;
  }

  if (isNonEmptyObject(filterBy)) {
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

  if (exactRegex) {
    filter.$or.push({ username: exactRegex});
  }
  // all users can access themselves, users they created, and the user who created them(?)

  filter.$or.push({ _id: user._id });
  filter.$or.push({ createdBy: user._id });

  if (mongooseUtils.isValidMongoId(user.createdBy)) {
    filter.$or.push({ _id: user.createdBy });
  }

  // all users need to be able to access users from any workspace they have access to

  if (isStudent) {
    let [ workspaceUsers, studentUsers, responseUsers, assignmentUsers ] = await Promise.all([
      utils.getUsersFromWorkspaces(user), utils.getStudentUsers(user), utils.getResponseUsers(user), utils.getAssignmentUsers(user)
    ]);

    if (isNonEmptyArray(workspaceUsers)) {
      filter.$or.push({ _id: {$in: workspaceUsers } });
    }

    if (isNonEmptyArray(studentUsers)) {
      filter.$or.push({ _id: {$in: studentUsers } });
    }

    if (isNonEmptyArray(responseUsers)) {
      filter.$or.push({ _id: {$in: responseUsers } });
    }

    if (isNonEmptyArray(assignmentUsers)) {
      filter.$or.push({ _id: {$in: assignmentUsers } });
    }

    return filter;
  }

  // all non-students can access any member from org

  if (mongooseUtils.isValidMongoId(user.organization)) {
    filter.$or.push({ organization: user.organization });
  }

  // all nonStudents can access any user associated with one of their sections
  // currently pdadmins and teachers have the same permisisons for getting users
  // pdadmins can do a lot more in terms of modifying / creating / deleting

  if (accountType === 'P') {
    let [ workspaceUsers, teacherUsers, responseUsers, assignmentUsers ] = await Promise.all([
      utils.getUsersFromWorkspaces(user), utils.getUsersFromTeacherSections(user), utils.getResponseUsers(user), utils.getAssignmentUsers(user)
    ]);

    if (isNonEmptyArray(workspaceUsers)) {
      filter.$or.push({ _id: {$in: workspaceUsers } });
    }

    if (isNonEmptyArray(teacherUsers)) {
      filter.$or.push({ _id: {$in: teacherUsers } });
    }

    if (isNonEmptyArray(responseUsers)) {
      filter.$or.push({ _id: {$in: responseUsers } });
    }

    if (isNonEmptyArray(assignmentUsers)) {
      filter.$or.push({ _id: {$in: assignmentUsers } });
    }

    return filter;
  }

  if (accountType === 'T') {
    let [ workspaceUsers, teacherUsers, responseUsers, assignmentUsers ] = await Promise.all([
      utils.getUsersFromWorkspaces(user), utils.getUsersFromTeacherSections(user), utils.getResponseUsers(user), utils.getAssignmentUsers(user)
    ]);
    if (isNonEmptyArray(workspaceUsers)) {
      filter.$or.push({ _id: {$in: workspaceUsers } });
    }

    if (isNonEmptyArray(teacherUsers)) {
      filter.$or.push({ _id: {$in: teacherUsers } });
    }

    if (isNonEmptyArray(responseUsers)) {
      filter.$or.push({ _id: {$in: responseUsers } });
    }

    if (isNonEmptyArray(assignmentUsers)) {
      filter.$or.push({ _id: {$in: assignmentUsers } });
    }

    return filter;
  }
  }catch(err) {
    console.error(`Error accessibleUsersQuery: ${err}`);
    console.trace();
  }

};

const canGetUser = async function(user, id, username) {
  let isValidId = mongooseUtils.isValidMongoId(id);
  let isValidUserName = isNonEmptyString(username);

  if (!isValidId && !isValidUserName) {
    return;
  }

  if (!isNonEmptyObject(user)) {
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

  // check if request user sent user a response

  let isResponseRelated = await utils.doesRecordExist('Response', {
    isTrashed: false,
    recipient: user._id,
    createdBy: requestedUser._id,
    status: 'approved'
  });

  if (isResponseRelated) {
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

const modifiableUserCriteria = async function(user, userIdToModify) {
  try {
    if (!user) {
      return;
    }
    const accountType = user.accountType;
    const actingRole = user.actingRole;

    let filter = {
      isTrashed: false
    };

    if (isValidMongoId(userIdToModify)) {
      if (!filter.$and) {
        filter.$and = [
          { _id: userIdToModify }
        ];
      }
    }
    // students can only modify their own account
    if (accountType === 'S' || actingRole === 'student') {

      filter._id = user._id;
      return filter;
    }

    if (accountType === 'A') {
      return filter;
    }

    filter.$or = [
      { _id: user._id }
    ];

    // teacher or pdadmin needs to be able to remove a user from one of their sections

    let teacherSectionUsers = await utils.getUsersFromTeacherSections(user);

    if (isNonEmptyArray(teacherSectionUsers)) {
      filter.$or.push({
        _id: { $in: teacherSectionUsers }
      });
    }
    // pdAdmins can modify anyone in their organization
    if (accountType === 'P') {
      if (isValidMongoId(user.organization)) {
        filter.$or.push({ organization: user.organization });

      }
      return filter;
    }
    // teachers can only modify themselves or users from their teacher sections
    if (accountType === 'T') {
      return filter;
    }
  }catch(err) {
    console.error(`Error modifiableUserCriteria: ${err}`);
    console.trace();
  }

};

const canModifyUser = async function(user, userIdToModify) {
  if (!isNonEmptyObject(user)) {
    return false;
  }
  const { id, accountType, actingRole } = user;

  const isStudent = accountType === 'S' || actingRole === 'student';

  // admins can always modify any user
  if (accountType === 'A' && !isStudent) {
    return true;
  }

  // can always modify self
  if (areObjectIdsEqual(id, userIdToModify)) {
    return true;
  }
  const criteria = await modifiableUserCriteria(user, userIdToModify );

  return utils.doesRecordExist('User', criteria);
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


//   if (!isNonEmptyObject(user)) {
//     results.errors.push('Invalid user');
//     return results;
//   }
//   if (!isNonEmptyObject(body)) {
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