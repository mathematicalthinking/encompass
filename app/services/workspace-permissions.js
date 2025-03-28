import Service, { service } from '@ember/service';

export default class WorkspacePermissionsService extends Service {
  @service('utility-methods') utils;
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }

  get isAdmin() {
    return this.user.isAdmin;
  }

  get isPdAdmin() {
    return this.user.isPdAdmin;
  }

  isOwner(ws) {
    let ownerId = this.utils.getBelongsToId(ws, 'owner');
    return ownerId === this.user.id;
  }

  isCreator(ws) {
    let creatorId = this.utils.getBelongsToId(ws, 'createdBy');
    return creatorId === this.user.id;
  }

  isInPdAdminDomain(ws) {
    if (!this.isPdAdmin) {
      return false;
    }
    let utils = this.utils;

    let userOrgId = utils.getBelongsToId(this.user, 'organization');
    let wsOrgId = utils.getBelongsToId(ws, 'organization');

    return userOrgId === wsOrgId;
  }

  canDelete(ws) {
    return this.isAdmin || this.isCreator(ws) || this.isOwner(ws);
  }

  hasOwnerPrivileges(ws) {
    return (
      this.isAdmin ||
      this.isOwner(ws) ||
      this.isCreator(ws) ||
      this.isInPdAdminDomain(ws)
    );
  }

  canCopy(ws) {
    // have to add a check is workspace is allowed to be copied
    return this.canDelete(ws) || this.isInPdAdminDomain(ws);
  }

  isFeedbackApprover(ws) {
    if (!ws) {
      return false;
    }

    let approvers = ws.feedbackAuthorizers || [];
    return approvers.includes(this.user.id);
  }

  canApproveFeedback(ws) {
    if (!ws || ws.workspaceType === 'parent') {
      return false;
    }
    return (
      this.isAdmin ||
      this.isOwner(ws) ||
      this.isCreator(ws) ||
      this.isFeedbackApprover(ws) ||
      this.isInPdAdminDomain(ws)
    );
  }

  canEdit(ws, recordType, requiredPermissionLevel) {
    const utils = this.utils;

    if (!utils.isNonEmptyObject(ws)) {
      return false;
    }

    let wsType = ws.workspaceType;

    if (wsType === 'parent') {
      // cannot create new selections or taggings or edit folders
      // still need to be able to see everything;
      if (requiredPermissionLevel > 1) {
        return false;
      }

      if (requiredPermissionLevel === 1 && recordType === 'feedback') {
        return false;
      }
    }

    if (
      this.isAdmin ||
      this.isOwner(ws) ||
      this.isCreator(ws) ||
      this.isInPdAdminDomain(ws)
    ) {
      return true;
    }

    let wsMode = ws.mode;

    let isPublic = wsMode === 'public' || wsMode === 'internet';

    // any user can at least view public workspaces
    if (isPublic && requiredPermissionLevel <= 1) {
      return true;
    }

    // check ws permissions

    const wsPermissions = ws.permissions;

    if (!utils.isNonEmptyArray(wsPermissions)) {
      return false;
    }

    const userPermissions = wsPermissions.findBy('user', this.user.id);
    if (!utils.isNonEmptyObject(userPermissions)) {
      return false;
    }

    const globalSetting = userPermissions.global;

    if (globalSetting === 'viewOnly') {
      return false;
    }
    if (globalSetting === 'approver') {
      return true;
    }

    if (recordType !== 'feedback' && globalSetting === 'editor') {
      return true;
    }

    // else custom

    const permissionLevel = userPermissions[recordType];

    if (recordType === 'feedback') {
      // to determine if user can respond at all
      if (requiredPermissionLevel === 1) {
        return permissionLevel !== 'none';
      }
      // to determine if user has direct send privileges
      if (requiredPermissionLevel === 2) {
        return permissionLevel === 'preAuth' || permissionLevel === 'approver';
      }

      if (requiredPermissionLevel === 3) {
        return permissionLevel === 'approver';
      }
    }

    return permissionLevel >= requiredPermissionLevel;
  }
}
