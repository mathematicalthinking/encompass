/* eslint-disable complexity */
const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const _ = require('underscore');

const objectUtils = require('../../utils/objects');
const { isNil, isNonEmptyObject, isNonEmptyArray, } = objectUtils;
const { areObjectIdsEqual, isValidMongoId } = mongooseUtils;

module.exports.get = {};

function getUserWsPermissions(user, ws) {
  if (!isNonEmptyObject(ws) || !isNonEmptyObject(user)) {
    return;
  }

  const userId = user._id;
  if (isNil(userId)) {
    return;
  }

  const permissionObjects = ws.permissions;
  if (!isNonEmptyArray(permissionObjects)) {
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
  if (!isNonEmptyObject(user) || !isNonEmptyObject(ws)) {
    return [false, null];
  }
  const userId = _.propertyOf(user)('_id');
  const ownerId = _.propertyOf(ws)(['owner','_id']);
  const creatorId = _.propertyOf(ws)(['createdBy', '_id']);

  if (isNil(userId) || isNil(ownerId) || isNil(creatorId)) {
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
  const isOrgPrivacy = ws.mode === 'org';

  // Students can access workspaces they've created and workspaces they've been added as collabs
  // (in their collabWorkspaces array)
  if (accountType === 'S' || actingRole === 'student') {
    if (isCreator || isOwner || isInternet) {
      return [true, null];
    }
    if (isCollaborator) {
      if (_.propertyOf(userPermissions)(['submissions', 'all']) !== true) {
        return [true, userPermissions];
      }
      let globalPermissions = userPermissions.global;

      // no access restrictions
      if (globalPermissions === 'directMentor' || globalPermissions === 'indirectMentor' || globalPermissions === 'approver') {
        return [true, null];
      }

      // responses restricted
      if (globalPermissions === 'viewOnly' || globalPermissions === 'editor') {
        return [true, userPermissions];
      }

      // make sure no restrictions
      const { folders, selections, comments, feedback } = userPermissions;

      if (folders === 0 || selections === 0 || comments === 0 || feedback === 'none') {
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

  // if ws mode is org and the org is the same as the user's
  let isOrgWs = isOrgPrivacy && areObjectIdsEqual(user.organization, ws.organization);

  // Any teacher or PdAdmin can view a workspace if they are the owner, editor, or ws is public
  if (isOwner || isCreator || isOrgWs || isPublic || isInternet) {
    return [true, null];
  }

  let ownerOrg = _.propertyOf(ws)(['owner', 'organization']);
  let userOrg = user.organization;
  let creatorOrg = _.propertyOf(ws)(['createdBy', 'organization']);

  let isInPdOrg = areObjectIdsEqual(ownerOrg, userOrg) || areObjectIdsEqual(creatorOrg, userOrg);


  // PdAdmins can get any workspace that is owned by a member of their org
  if (accountType === 'P') {
    if (isInPdOrg) {
      return [true, null];
    }
  }

  if (isCollaborator) {
    if (_.propertyOf(userPermissions)(['submissions', 'all']) !== true) {
      return [true, userPermissions];
    }
    let globalPermissions = userPermissions.global;

      // no access restrictions
      if (globalPermissions === 'directMentor' || globalPermissions === 'indirectMentor' || globalPermissions === 'approver') {
        return [true, null];
      }

      // responses restricted
      if (globalPermissions === 'viewOnly' || globalPermissions === 'editor') {
        return [true, userPermissions];
      }

      // make sure no restrictions
      const { folders, selections, comments, feedback } = userPermissions;

      if (folders === 0 || selections === 0 || comments === 0 || feedback === 'none') {
        return [true, userPermissions];
      }

      // no feedback restrictions
      return [true, null];

    }
    // user is neither owner, creator, collaborator and workspace is not public
    return [false, null];

};

const accessibleWorkspacesQuery = async function(user, ids, filterBy, searchBy, isTrashedOnly=false) {

  if (!isNonEmptyObject(user)) {
    return {};
  }
  if (isTrashedOnly) {
    return { isTrashed: true };
  }
  const { accountType, actingRole, collabWorkspaces } = user;

  let isStudent = accountType === 'S' || actingRole === 'student';

  let filter = {
    $and: []
  };

  filter.$and.push({ isTrashed: false });

  if (isNonEmptyArray(ids)) {
    filter.$and.push({_id: {$in : ids } });
  } else if (mongooseUtils.isValidMongoId(ids)) {
    filter.$and.push({_id: ids });
  }
  if (isNonEmptyObject(filterBy)) {
    filter.$and.push(filterBy);
  }

  if (isNonEmptyObject(searchBy)) {
    filter.$and.push(searchBy);
  }

  if (accountType === 'A' && !isStudent) {
    return filter;
  }

  let accessCrit = {$or: []};

  // all users can access any workspace theyve created, own, or are collab in

  accessCrit.$or.push({ createdBy : user._id });
  accessCrit.$or.push({ owner: user._id});

    let workspacesOwnSubs = await utils.getWorkspacesWithOwnSubmissions(user);
    if (isNonEmptyArray(workspacesOwnSubs)) {
      accessCrit.$or.push({_id: {$in: workspacesOwnSubs}});
    }

  if (isNonEmptyArray(collabWorkspaces)) {
    accessCrit.$or.push({_id: {$in: collabWorkspaces}});
  }

  if (isStudent) {
    accessCrit.$or.push({ mode: 'internet' });

    filter.$and.push(accessCrit);
    return filter;
  }

  // assignments of type workspace with ws reference?

  accessCrit.$or.push({ mode: { $in: ['public', 'internet'] } });

// will only reach here if admins/pdadmins are in actingRole teacher
// Teachers and PdAdmins

  if (accountType === 'P') {
    const userOrg = user.organization;

    if (mongooseUtils.isValidMongoId(userOrg)) {
      accessCrit.$or.push({organization: user.organization});

      const userIds = await utils.getModelIds('User', { organization: userOrg });
      if (isNonEmptyArray(userIds)) {
        accessCrit.$or.push({
          createdBy: { $in: userIds },
          owner: {$in: userIds }
        });
      }
    }

    filter.$and.push(accessCrit);

    return filter;
  }

  if (accountType === 'T') {
    // Workspaces where a teacher is the primary teacher or in the teachers array

    // assignment workspaces?
    accessCrit.$or.push({'teacher.id': user.id});
    accessCrit.$or.push({'teachers': user.id});

    filter.$and.push(accessCrit);

    return filter;
  }
};

// currently used to check if users can select, comment, create taggings, or create responses in workspaces
function canModify(user, ws, recordType, requiredPermissionLevel) {
  let workspaceOwnerId = _.propertyOf(ws)(['owner', '_id']);
  let workspaceCreatorId = _.propertyOf(ws)(['createdBy', '_id']);
  let userId = _.propertyOf(user)('_id');

  for (let id of ([workspaceOwnerId, workspaceCreatorId, userId])) {
    if (!isValidMongoId(id)) {
      return false;
    }
  }

  const isOwner = areObjectIdsEqual(userId, workspaceOwnerId);
  const isCreator = areObjectIdsEqual(userId, workspaceCreatorId);

  if (isOwner || isCreator) {
    return true;
  }

  const actingRole = user.actingRole;

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
    let wsOrg = ws.organization;

    for (let orgId of [ownerOrg, creatorOrg, wsOrg]) {
      if (areObjectIdsEqual(pdOrg, orgId)) {
        return true;
      }
    }
  }

  const userPermissions = getUserWsPermissions(user, ws);

  if (_.isUndefined(userPermissions)) {
    return false;
  }

  const globalPermissions = userPermissions.global;

  if (globalPermissions === 'approver') {
    return true;
  }
  if (globalPermissions === 'viewOnly') {
    return false;
  }
  // else custom permissions

  const permissionLevel = userPermissions[recordType];

  if (_.contains(['folders', 'selections', 'comments'], recordType)) {
    return permissionLevel >= requiredPermissionLevel;
  }

  if (recordType === 'feedback') {
    // to determine if user can respond at all
    if (requiredPermissionLevel === 1) {
      return permissionLevel !== 'none';
    }
    // to determine if user has direct send privileges
    if (requiredPermissionLevel === 2) {
      return permissionLevel === 'preAuth' || permissionLevel === 'approver';
    }
    // to determine if user can approve feedback
    if (requiredPermissionLevel === 3) {
      return permissionLevel === 'approver';
    }
  }

  return false;

}

function canUpdateSubmissions(user, ws, updateType) {
  if (!isNonEmptyObject(user) || !isNonEmptyObject(ws)) {
    return false;
  }
  if (!isNonEmptyObject(ws.owner) || !isNonEmptyObject(ws.createdBy)) {
    return false;
  }

  if (isNil(ws.owner._id) || isNil(ws.createdBy._id)) {
    return false;
  }

  const actingRole = user.actingRole;

  const isOwner = areObjectIdsEqual(user._id, ws.owner._id);
  const isCreator = areObjectIdsEqual(user._id, ws.createdBy._id);

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

    if (areObjectIdsEqual(pdOrg, ownerOrg) || areObjectIdsEqual(pdOrg, creatorOrg)) {
      return true;
    }
  }
  // at this point, user is not Owner, creator, admin, or the proper pdadmin
  // thus they can not remove submissions or do a mass update of the workspace, only add their own submissions


  // for now always let admins, owners, creators, or org pdadmins to update submissions regardless of this flag

  if (!ws.doAllowSubmissionUpdates) {
    return false;
  }

  // should teachers or approvers be able to do this?
  if (updateType === 'bulk') {
    return false;
  }

  let sectionTeachers = _.propertyOf(ws)(['linkedAssignment', 'section', 'teachers']);
  let isTeacher;

  if (Array.isArray(sectionTeachers)) {
    isTeacher = _.find(sectionTeachers, (teacher) => {
      return areObjectIdsEqual(teacher, user._id);
    }) !== undefined;
  }
  if (updateType === 'remove') {
    return isTeacher;
  }

  if (updateType === 'add') {
    if (isTeacher) {
      return true;
    }

    // student who has answer in workspace and has permission should be able to add
    let existingStudentSub = _.find(ws.submissions, (sub) => {
      return areObjectIdsEqual(_.propertyOf(sub)(['creator', 'studentId']), user._id);
    });
    if (existingStudentSub) {
      return true;
    }

    let assignmentStudents = _.propertyOf(ws)(['linkedAssignment', 'students']);

    let isStudent;

    if (Array.isArray(assignmentStudents)) {
      isStudent = _.find(assignmentStudents, (student) => {
        return areObjectIdsEqual(student, user._id);
      }) !== undefined;
    }
    if (isStudent) {
      return true;
    }

    // what about situations where there is not a linked assignment?
    // cannot allow a student to add a submission to any ws where one of their answers
    // is already contained because could be a copied ws
  }
  return false;

}

module.exports.get.workspace = canLoadWorkspace;
module.exports.get.workspaces = accessibleWorkspacesQuery;
module.exports.canModify = canModify;
module.exports.canUpdateSubmissions = canUpdateSubmissions;