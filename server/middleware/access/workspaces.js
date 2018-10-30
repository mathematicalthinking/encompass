const utils = require('./utils');
const _     = require('underscore');

module.exports.get = {};

const canLoadWorkspace = function(user, ws) {
  if (!user || !ws) {
    return false;
  }
  const accountType = user.accountType;

  // As of now, students cannot get any workspaces
  if (accountType === 'S') {
    return false;
  }

  // Admins can get any workspace
  if (accountType === 'A') {
    return true;
  }
  let ownerOrg;
  let userOrg;

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


  // PdAdmins can get any workspace that is owned by a member of their org
  if (accountType === 'P') {
    if (ownerOrg === userOrg) {
      return true;
    }
  }

  const userId = user._id.toString();
  const ownerId = ws.owner._id.toString();

  const isOwner = userId === ownerId;

    const wsEditors = ws.editors.map(ws => ws._id.toString());
    const isEditor = wsEditors.includes(userId);
    console.log('isEditor canLoadWorkspace? ', isEditor);

    const isPublic = ws.mode === 'public';

  // Any teacher or PdAdmin can view a workspace if they are the owner, editor, or ws is public
  // Should we allow students be added as an editor to a WS? Or view as read-only public workspaces?
  return isOwner || isEditor || isPublic;
};

const accessibleWorkspacesQuery = async function(user, ids, filterBy, searchBy) {

  if (!user) {
    return [];
  }
  const { accountType, actingRole } = user;

  let filter = {
    $and: []
  };

  filter.$and.push({ isTrashed: false });

  if (ids) {
    filter.$and.push({_id: {$in : ids } });
  }
  if (!_.isEmpty(filterBy)) {
    filter.$and.push(filterBy);
  }

  if (searchBy) {
    filter.$and.push(searchBy);
  }

  let accessCrit = {$or: []};


  // should be stopped earlier in the middleware chain
  if (actingRole === 'student' || accountType === 'S') {
    accessCrit.$or.push({ createdBy : user.id });

    filter.$and.push(accessCrit);

    return filter;
  }

  // filter.$or = [];
 accessCrit.$or.push({ mode: 'public' });
 accessCrit.$or.push({ editors: user._id });
 accessCrit.$or.push({ owner: user._id });

  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }
  // Teachers and PdAdmins


  if (accountType === 'P') {

    const userOrg = user.organization;
    const userIds = await utils.getModelIds('User', { organization: userOrg, accountType: {$ne: 'S'} });

    accessCrit.$or.push({owner: {$in : userIds}});

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
function canModify(user, ws) {
  if (!user || !ws) {
    return false;
  }
  const isAdmin = user.accountType === 'A';

  if (isAdmin) {
    return true;
  }

  const isOwner = user.id === ws.owner._id.toString();

  if (isOwner) {
    return true;
  }

  const editorIds = ws.editors.map(obj => obj._id.toString());

  const isEditor = _.includes(editorIds, user.id);

  if (isEditor) {
    return true;
  }

  //pdAdmins should be able to modify any ws where the owner belongs to their org

  const isPdAdmin = user.accountType === 'P';

  if (isPdAdmin) {
    let pdOrg = user.organization;
    let wsOwner = ws.owner;

    if (!wsOwner || !pdOrg) {
      return;
    }
    let wsOwnerOrg = wsOwner.organization;
    if (!wsOwnerOrg) {
      return;
    }

    pdOrg = pdOrg.toString();
    wsOwnerOrg = wsOwnerOrg.toString();

    if (pdOrg === wsOwnerOrg) {
      return true;
    }
  }
    return false;
}

module.exports.get.workspace = canLoadWorkspace;
module.exports.get.workspaces = accessibleWorkspacesQuery;
module.exports.canModify = canModify;