const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;

module.exports.get = {};

// returns ids of records that user does NOT have access to in workspaces that they can view


const accessibleTaggingsQuery = async function(user, ids) {
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


    // should students ever be getting taggings?
    // if (actingRole === 'student' || accountType === 'S') {
    //   filter.createdBy = user._id;
    //   return filter;
    // }
    // will only reach here if admins/pdadmins are in actingRole teacher



    const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);


    // everyone should have access to all taggings that belong to a workspace that they have access to

    // have to check if any of these workspaces are restricted access
    const orFilter = { $or: [] };
    orFilter.$or.push({ createdBy: user._id });
    orFilter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    // returns array of Ids
    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'taggings');

    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    //should have access to all taggings that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any taggings created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      orFilter.$or.push({createdBy : {$in : userIds}});
      filter.$and.push(orFilter);
      return filter;
    }

    if (accountType === 'T') {
    // should teachers be able to get all taggings from organization?
    // orFilter.$or.push({ createdBy : user._id });
      filter.$and.push(orFilter);
      return filter;
    }

  }catch(err) {
    console.trace();
    console.error(`error building accessible taggings critera: ${err}`);
  }
};

const canGetTagging = async function(user, taggingId) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';
  // if (accountType === 'S' || actingRole === 'student') {
  //   return false; // currently we are blocking students from getting taggings
  // }

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all taggings
  }

  // use accessibleTaggings criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleTaggingsQuery(user, taggingId);
  let accessibleIds = await utils.getModelIds('Tagging', criteria);

  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence
    if (accessibleIds.includes(taggingId)) {
      return true;
    }
    return false;
};

module.exports.get.taggings = accessibleTaggingsQuery;
module.exports.get.tagging = canGetTagging;