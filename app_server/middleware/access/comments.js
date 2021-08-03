const utils = require('./utils');
const _ = require('underscore');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;


module.exports.get = {};

const accessibleCommentsQuery = async function(user, ids) {
  try {
    if (!isNonEmptyObject(user)) {
      return {};
    }

    const { accountType, actingRole } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };


      if (isNonEmptyArray(ids)) {
        filter.$and.push({ _id: { $in : ids } });
      } else if(mongooseUtils.isValidMongoId(ids)) {
        filter.$and.push({ _id: ids });
      }

      if (accountType === 'A' && !isStudent) {
        return filter;
      }
    const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);


    // everyone should have access to all comments that belong to a workspace that they have access to
    const orFilter = { $or: [] };
    orFilter.$or = [];
    orFilter.$or.push({ createdBy: user._id });
    orFilter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'comments');

    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    //should have access to all comments that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any comments created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      orFilter.$or.push({createdBy : {$in : userIds}});
      filter.$and.push(orFilter);

      return filter;
    }

    if (accountType === 'T') {
    // teachers can get any comments where they are the primary teacher or in the teachers array
    // should teachers be able to get all comments from organization?

    // createdBy is already taken care of above
      // filter.$or.push({ createdBy : user._id });
      // filter.$or.push({ 'teacher.id': user.id });
      // filter.$or.push({ teachers : user.id });
      filter.$and.push(orFilter);

      return filter;
    }

  }catch(err) {
    console.trace();
    console.error(`error building accessible comments critera: ${err}`);
  }
};

const canGetComment = async function(user, commentId) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';

  // if (accountType === 'S' || actingRole === 'student') {
  //   return false; // currently we are blocking students from getting comments
  // }

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all comments
  }

  // use accessibleComments criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleCommentsQuery(user, commentId);
  let accessibleIds = await utils.getModelIds('Comment', criteria);

  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence
  return _.contains(accessibleIds, commentId);
};

module.exports.get.comments = accessibleCommentsQuery;
module.exports.get.comment = canGetComment;