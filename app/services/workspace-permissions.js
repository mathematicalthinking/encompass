Encompass.WorkspacePermissionsService = Ember.Service.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),

  isAdmin: function() {
    let accountType = this.get('currentUser').get('accountType');
    if (accountType === "A") {
      return true;
    } else {
      return false;
    }
  },

  isOwner: function (ws) {
    let currentUserId = this.get('currentUser').get('id');
    let ownerId = ws.get('owner').get('id');
    if (currentUserId === ownerId) {
      return true;
    } else {
      return false;
    }
  },

  isEditor: function (ws) {
    let currentUser = this.get('currentUser');
    let editors = ws.get('editors');

    if (editors.includes(currentUser)) {
      return true;
    } else {
      return false;
    }
  },

  isCreator: function (ws) {
    let currentUserId = this.get('currentUser.id');
    let creatorId = ws.get('createdBy.id');
    return currentUserId === creatorId;
  },

  isInPdAdminDomain: function(ws) {
    let user = this.get('currentUser');
    let type = user.get('accountType');
    if (type !== 'P') {
      return false;
    }
    let userOrg = user.get('organization.content');
    let ownerOrg = ws.get('owner.organization.content');
    return Ember.isEqual(ownerOrg, userOrg);
  },

  canDelete: function(ws) {
    return this.isCreator(ws) || this.isOwner(ws) || this.isAdmin();
  },

  canEdit: function (ws, recordType, requiredPermissionLevel) {
    const utils = this.get('utils');
    if (!utils.isNonEmptyObject(ws)) {
      return false;
    }

    if (this.isAdmin() || this.isOwner(ws) || this.isCreator(ws) || this.isInPdAdminDomain(ws)) {
      return true;
    }

    // check ws permissions

    const wsPermissions = ws.get('permissions');
    if (!utils.isNonEmptyArray(wsPermissions)) {
      return false;
    }

    const userPermissions = wsPermissions.findBy('user', this.get('currentUser.id'));
    if (!utils.isNonEmptyObject(userPermissions)) {
      return false;
    }

    const globalSetting = userPermissions.global;

    if (globalSetting === 'viewOnly') {
      return false;
    }
    if (globalSetting === 'editor') {
      return true;
    }

    // else custom

    const permissionLevel = userPermissions[recordType];
    if (recordType === 'feedback') {
      return permissionLevel !== 'none';
    }

    return permissionLevel >= requiredPermissionLevel;
  },

});
