const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;

module.exports.get = {};

// returns ids of records that user does NOT have access to in workspaces that they can view


const accessibleSelectionsQuery = async function(user, ids) {
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


    // should students ever be getting selections?
    // if (actingRole === 'student' || accountType === 'S') {
    //   filter.createdBy = user._id;
    //   return filter;
    // }
    // will only reach here if admins/pdadmins are in actingRole teacher



    const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);


    // everyone should have access to all selections that belong to a workspace that they have access to

    // have to check if any of these workspaces are restricted access
    const orFilter = { $or: [] };
    orFilter.$or.push({ createdBy: user._id });
    orFilter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    // returns array of Ids
    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'selections');

    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    //should have access to all selections that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any selections created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      orFilter.$or.push({createdBy : {$in : userIds}});
      filter.$and.push(orFilter);
      return filter;
    }

    if (accountType === 'T') {
    // should teachers be able to get all selections from organization?
    // orFilter.$or.push({ createdBy : user._id });
      filter.$and.push(orFilter);
      return filter;
    }

  }catch(err) {
    console.trace();
    console.error(`error building accessible selections critera: ${err}`);
  }
};

const canGetSelection = async function(user, selectionId) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';
  // if (accountType === 'S' || actingRole === 'student') {
  //   return false; // currently we are blocking students from getting selections
  // }

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all selections
  }

  // use accessibleSelections criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleSelectionsQuery(user, selectionId);
  let accessibleIds = await utils.getModelIds('Selection', criteria);

  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence
    if (accessibleIds.includes(selectionId)) {
      return true;
    }
    return false;
};

module.exports.get.selections = accessibleSelectionsQuery;
module.exports.get.selection = canGetSelection;