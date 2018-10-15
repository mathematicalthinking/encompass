Encompass.WorkspacePermissionsService = Ember.Service.extend(Encompass.CurrentUserMixin, {

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
    let currentUser= this.get('currentUser');
    let editors = ws.get('editors');

    if (editors.includes(currentUser)) {
      return true;
    } else {
      return false;
    }
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

  canEdit: function (ws) {
    return this.isAdmin() || this.isOwner(ws)|| this.isEditor(ws) || this.isInPdAdminDomain(ws);
  },

});
