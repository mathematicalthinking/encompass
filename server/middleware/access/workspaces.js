const utils = require('./utils');
module.exports.get = {};

const canLoadWorkspace = function(user, ws) {
  console.log('ws.editors', ws.editors);
  const accountType = user.accountType;

  if (accountType === 'S' || user.actingRole === 'student') {
    return false;
  }
  if (accountType === 'A') {
    return true;
  }

  const ownerOrg = ws.owner.organization.toString();
  const userOrg = user.organization.toString();

  if (accountType === 'P') {
    if (ownerOrg === userOrg) {
      return true;
    }
  }
  const wsId = ws._id.toString();
  const userId = user._id.toString();


  const isOwner = userId === wsId;

  const wsEditors = ws.editors.map(ws => ws._id.toString());
  const isEditor = wsEditors.includes(userId);
  console.log('isEditor', isEditor);
  const isPublic = ws.mode === 'public';

  return isOwner || isEditor || isPublic;
};

const accessibleWorkspacesQuery = async function(user, ids) {
  const accountType = user.accountType;
  const actingRole = user.actingRole;


  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in : ids};
  }

  if (actingRole === 'student' || accountType === 'S') {
    //filter.createdBy = user.id;
    return filter;
  }
  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }
  filter.$or = [];
  filter.$or.push({mode: 'public'});
  filter.$or.push({editors: user._id});

  if (accountType === 'P') {
    // only answers tied to organization
    //get users from org and then ch
    const userOrg = user.organization;
    const userIds = await utils.getModelIds('Organization', {_id: userOrg});

    filter.$or.push({owner: {$in : userIds}});
    return filter;
  }

  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    filter.$or.push({'teacher.id': user.id});
    filter.$or.push({'teachers': user.id});
    return filter;
  }
};

module.exports.get.workspace = canLoadWorkspace;
module.exports.get.workspaces = accessibleWorkspacesQuery;