const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;

module.exports.get = {};

const accessibleFoldersQuery = async function(user, ids) {
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

    // everyone should have access to all folders that belong to a workspace that they have access to
    const orFilter = { $or: [] };
    orFilter.$or.push({ createdBy: user._id });
    orFilter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    //should have access to all folders that you created
    // in case they are not in a workspace

    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'folders');

    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    if (accountType === 'P') {
      // PDamins can get any folders created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      orFilter.$or.push({createdBy : {$in : userIds}});
      filter.$and.push(orFilter);

      return filter;
    }

    if (accountType === 'T') {
      // should teachers be able to get all folders from organization?
      // filter.$or.push({ createdBy : user._id });
      filter.$and.push(orFilter);

      return filter;
    }

  }catch(err) {
    console.trace();
    console.error(`error building accessible folders critera: ${err}`);
  }
};

const canGetFolder = async function(user, folderId) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all folders
  }

  // use accessibleFolders criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleFoldersQuery(user, folderId);
  let accessibleIds = await utils.getModelIds('Folder', criteria);

  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence

  return accessibleIds.includes(folderId);
};

module.exports.get.folders = accessibleFoldersQuery;
module.exports.get.folder = canGetFolder;