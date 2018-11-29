const utils = require('./utils');
const apiUtils = require('../../datasource/api/utils');
const _     = require('underscore');

module.exports.get = {};

function getUserWsPermissions(user, ws) {
  if (!apiUtils.isNonEmptyObject(ws) || !apiUtils.isNonEmptyObject(user)) {
    return;
  }

  const userId = user._id;
  if (apiUtils.isNullOrUndefined(userId)) {
    return;
  }

  const permissionObjects = ws.permissions;
  if (!apiUtils.isNonEmptyArray(permissionObjects)) {
    return;
  }

  return _.find(permissionObjects, (obj) => {
    return _.isEqual(userId, obj.user);
  });
}

// ws has owner and editors populated
// should return [boolean can Load, customPermissions]
// only return customPermissions if restricted else null
// eslint-disable-next-line complexity
const canLoadWorkspace = function(user, ws) {
  if (!apiUtils.isNonEmptyObject(user) || !apiUtils.isNonEmptyObject(ws)) {
    return [false, null];
  }
  const userId = _.propertyOf(user)('_id');
  const ownerId = _.propertyOf(ws)(['owner','_id']);
  const creatorId = _.propertyOf(ws)(['createdBy', '_id']);

  if (apiUtils.isNullOrUndefined(userId) || apiUtils.isNullOrUndefined(ownerId) || apiUtils.isNullOrUndefined(creatorId)) {
    return [false, null];
  }

  const accountType = user.accountType;
  const actingRole = user.actingRole;

  const isCreator = userId.toString() === creatorId.toString();
  const isOwner = userId.toString() === ownerId.toString();

  const userPermissions = getUserWsPermissions(user, ws);
  const isCollaborator = !_.isUndefined(userPermissions);

  const isPublic = ws.mode === 'public';
  const isInternet = ws.mode === 'internet';

  // Students can access workspaces they've created and workspaces they've been added as collabs
  // (in their collabWorkspaces array)
  if (accountType === 'S' || actingRole === 'student') {
    if (isCreator || isOwner || isInternet) {
      return [true, null];
    }
    if (isCollaborator) {
      if (userPermissions.answers === 'user') {
        return [true, userPermissions];
      }
      if (userPermissions.global === 'editor' || userPermissions.global === 'viewOnly') {
        return [true, null];
      }
        // make sure no restrictions
        const { folders, selections, comments } = userPermissions;

        if (folders === 0 || selections === 0 || comments === 0) {
          return [true, userPermissions];
        }

        // student has permission with no view restrictions
        return [true, null];

      }
      // student does not have permission
      return [false, null];
  }

  // Admins can get any workspace
  if (accountType === 'A') {
    return [true, null];
  }

  let ownerOrg;
  let userOrg;
  let creatorOrg;

  if (ws.owner.organization) {
    ownerOrg = ws.owner.organization.toString();
  } else {
    ownerOrg === null;
  }
  if (user.organization) {
    userOrg = user.organization.toString();
  } else {
    userOrg === null;
  }

  if (ws.createdBy.organization) {
    creatorOrg = ws.createdBy.organization.toString();
  } else {
    creatorOrg = null;
  }


  // PdAdmins can get any workspace that is owned by a member of their org
  if (accountType === 'P') {
    if (ownerOrg === userOrg || creatorOrg === userOrg) {
      return [true, null];
    }
  }

  // Any teacher or PdAdmin can view a workspace if they are the owner, editor, or ws is public
  if (isOwner || isCreator || isPublic || isInternet) {
    return [true, null];
  }

  if (isCollaborator) {
    if (userPermissions.answers === 'user') {
      return [true, userPermissions];
    }
    if (userPermissions.global === 'editor' || userPermissions.global === 'viewOnly') {
      return [true, null];
    }
      // make sure no restrictions
      const { folders, selections, comments } = userPermissions;


      if (folders === 0 || selections === 0 || comments === 0) {
        return [true, userPermissions];
      }

      // user has permission with no view restrictions
      return [true, null];

    }
    // user is neither owner, creator, collaborator and workspace is not public
    return [false, null];

};

const accessibleWorkspacesQuery = async function(user, ids, filterBy, searchBy) {

  if (!apiUtils.isNonEmptyObject(user)) {
    return {};
  }
  const { accountType, actingRole, collabWorkspaces } = user;

  let filter = {
    $and: []
  };

  filter.$and.push({ isTrashed: false });

  if (apiUtils.isNonEmptyArray(ids)) {
    filter.$and.push({_id: {$in : ids } });
  }
  if (apiUtils.isNonEmptyObject(filterBy)) {
    filter.$and.push(filterBy);
  }

  if (apiUtils.isNonEmptyObject(searchBy)) {
    filter.$and.push(searchBy);
  }

  let accessCrit = {$or: []};

  // should be stopped earlier in the middleware chain
  if (actingRole === 'student' || accountType === 'S') {
    accessCrit.$or.push({ createdBy : user.id });
    accessCrit.$or.push({ owner: user.id});
    accessCrit.$or.push({ mode: 'internet' });

    if (apiUtils.isNonEmptyArray(collabWorkspaces)) {
      accessCrit.$or.push({_id: {$in: collabWorkspaces}});
    }

    filter.$and.push(accessCrit);

    return filter;
  }

  if (accountType === 'A') {
    return filter;
  }

  accessCrit.$or.push({ mode: { $in: ['public', 'internet'] } });
  accessCrit.$or.push({ owner: user._id });
  accessCrit.$or.push({ createdBy : user.id });


 if (apiUtils.isNonEmptyArray(collabWorkspaces)) {
  accessCrit.$or.push({_id: {$in: collabWorkspaces}});
}
// will only reach here if admins/pdadmins are in actingRole teacher
// Teachers and PdAdmins

  if (accountType === 'P') {
    const userOrg = user.organization;
    const userIds = await utils.getModelIds('User', { organization: userOrg });

    accessCrit.$or.push({owner: {$in : userIds}});
    accessCrit.$or.push({createdBy: {$in : userIds}});
    accessCrit.$or.push({organization: user.organization});

    filter.$and.push(accessCrit);

    return filter;
  }

  if (accountType === 'T') {
    // Workspaces where a teacher is the primary teacher or in the teachers array

    accessCrit.$or.push({'teacher.id': user.id});
    accessCrit.$or.push({'teachers': user.id});

    filter.$and.push(accessCrit);

    return filter;
  }
};

// currently used to check if users can select, comment, create taggings, or create responses in workspaces
function canModify(user, ws, recordType, requiredPermissionLevel) {
  if (!user || !ws) {
    return false;
  }

  if (!apiUtils.isNonEmptyObject(ws.owner) || !apiUtils.isNonEmptyObject(ws.createdBy)) {
    return false;
  }

  if (apiUtils.isNullOrUndefined(ws.owner._id) || apiUtils.isNullOrUndefined(ws.createdBy._id)) {
    return false;
  }

  const actingRole = user.actingRole;

  const isOwner = user.id === ws.owner._id.toString();
  const isCreator = user.id === ws.createdBy._id.toString();

  if (isOwner || isCreator) {
    return true;
  }

  const isAdmin = user.accountType === 'A';

  if (isAdmin && actingRole !== 'student') {
    return true;
  }

  const isPdAdmin = user.accountType === 'P';
    //pdAdmins should be able to modify any ws where the owner or creator belongs to their org

  if (isPdAdmin && actingRole !== 'student') {
    let pdOrg = user.organization;
    let ownerOrg = ws.owner.organization;
    let creatorOrg = ws.createdBy.organization;

    if (_.isEqual(pdOrg, ownerOrg) || _.isEqual(pdOrg, creatorOrg)) {
      return true;
    }
  }

  const userPermissions = getUserWsPermissions(user, ws);

  if (_.isUndefined(userPermissions)) {
    return false;
  }

  const globalPermissions = userPermissions.global;
  if (globalPermissions === 'editor') {
    return true;
  }
  if (globalPermissions === 'readOnly') {
    return false;
  }
  // else custom permissions

  const permissionLevel = userPermissions[recordType];

  if (_.contains(['folders', 'selections', 'comments'], recordType)) {
    return permissionLevel >= requiredPermissionLevel;
  }

  if (recordType === 'feedback') {
    return permissionLevel !== 'none';
  }

  return false;

}

module.exports.get.workspace = canLoadWorkspace;
module.exports.get.workspaces = accessibleWorkspacesQuery;
module.exports.canModify = canModify;