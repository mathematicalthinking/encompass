const utils = require('./utils');

module.exports.get = {};

const accessibleSelectionsQuery = async function(user, ids) {
  try {
    const accountType = user.accountType;
    const actingRole = user.actingRole;

    let filter = {
      isTrashed: false,
    };

    if (ids) {
      if (Array.isArray(ids)) {
        filter._id = {$in : ids};
      } else {
        filter._id = ids;
      }
    }


    // should students ever be getting selections?
    if (actingRole === 'student' || accountType === 'S') {
      filter.createdBy = user._id;
      return filter;
    }
    // will only reach here if admins/pdadmins are in actingRole teacher

    if (accountType === 'A') {
      return filter;
    }

    const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);


    // everyone should have access to all selections that belong to a workspace that they have access to
    filter.$or = [];
    filter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    //should have access to all selections that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any selections created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      filter.$or.push({createdBy : {$in : userIds}});
      return filter;
    }

    if (accountType === 'T') {
    // should teachers be able to get all selections from organization?
    filter.$or.push({ createdBy : user._id });

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

  if (accountType === 'S' || actingRole === 'student') {
    return false; // currently we are blocking students from getting selections
  }

  if (accountType === 'A') {
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