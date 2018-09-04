const utils = require('./utils');
const _     = require('underscore');

module.exports.get = {};

const canLoadWorkspace = function(user, ws) {
  if (!user || !ws) {
    return false;
  }
  const accountType = user.accountType;

  // As of now, students cannot get any workspaces
  if (accountType === 'S' || user.actingRole === 'student') {
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

  const wsId = ws._id.toString();
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

const accessibleWorkspacesQuery = async function(user, ids) {
  const accountType = user.accountType;
  const actingRole = user.actingRole;


  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in: ids};
  }

  // should be stopped earlier in the middleware chain
  if (actingRole === 'student' || accountType === 'S') {
    filter.createdBy = user.id;
    return filter;
  }
  filter.$or = [];
  filter.$or.push({ mode: 'public' });
  filter.$or.push({ editors: user._id });
  filter.$or.push({ owner: user._id });

  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }
  // Teachers and PdAdmins


  if (accountType === 'P') {

    const userOrg = user.organization;
    const userIds = await utils.getModelIds('User', { organization: userOrg, accountType: {$ne: 'S'} });

    filter.$or.push({owner: {$in : userIds}});

    return filter;
  }

  if (accountType === 'T') {
    // Workspaces where a teacher is the primary teacher or in the teachers array

    filter.$or.push({'teacher.id': user.id});
    filter.$or.push({'teachers': user.id});

    return filter;
  }
};
// currently used to check if users can select, comment, create taggings, or create responses in workspaces
function canModify(user, ws) {
  if (!user || !ws) {
    return false;
  }
  var isAdmin = user.accountType === 'A';
  var isOwner = user.id === ws.owner._id.toString();
  var editorIds = ws.editors.map(obj => obj._id.toString());

  var isEditor = _.includes(editorIds, user.id);
  return isAdmin || isOwner || isEditor;
}

module.exports.get.workspace = canLoadWorkspace;
module.exports.get.workspaces = accessibleWorkspacesQuery;
module.exports.canModify = canModify;