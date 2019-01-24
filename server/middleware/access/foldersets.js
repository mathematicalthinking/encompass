const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;

module.exports.get = {};

const accessibleFolderSetsQuery = function(user, ids) {
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

    // everyone can get public folder sets and ones theyve created
    let orFilter = { $or : [
      { createdBy: user._id },
      { privacySetting: 'E' }
    ]};

    if (isStudent || accountType === 'T') {
      // students can access public foldersets, sets theyve created,
      // and sets from their org with privacy setting "O"
      if (user.organization) {
        orFilter.$or.push({$and: [
          { privacySetting: 'O' },
          { organization: user.organization }
        ]});
      }
      filter.$and.push(orFilter);
      return filter;
}

    if (accountType === 'P') {
      // PDamins can get any folders created by someone from their organization
      const userOrg = user.organization;
      if (userOrg) {
        orFilter.$or.push({organization: userOrg });
      }
      filter.$and.push(orFilter);
      return filter;
    }
  }catch(err) {
    console.trace();
    console.error(`error building accessible folders critera: ${err}`);
  }
};

const canGetFolderSet = async function(user, folderSetId) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all folderSets
  }

  // use accessibleFolderSets criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleFolderSetsQuery(user, folderSetId);
  let accessibleIds = await utils.getModelIds('FolderSet', criteria);

  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence

  return accessibleIds.includes(folderSetId);
};

module.exports.get.folderSets = accessibleFolderSetsQuery;
module.exports.get.folderSet = canGetFolderSet;