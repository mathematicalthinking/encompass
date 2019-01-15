Encompass.WorkspaceInfoCollaboratorsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: ['workspace-info-collaborators'],
  utils: Ember.inject.service('utility-methods'),
  alert: Ember.inject.service('sweet-alert'),

  workspacePermissions: function() {
    let permissions = this.get('workspace.permissions');
    let collabs = this.get('originalCollaborators');

    if (!this.get('utils').isNonEmptyArray(permissions)) {
      return [];
    }
    //for each permissions object replace the userId with the user object
    //start with array of object and return array of objects
    if (this.get('utils').isNonEmptyArray(collabs)) {
      return permissions.map((permission) => {
        permission.userObj = this.get('store').peekRecord('user', permission.user);
        return permission;
      });
    }
    return [];

  }.property('workspace.permissions.[]', 'originalCollaborators.[]'),

  actions: {
    removeCollab(user) {
      console.log('removeCollab clicked', user);
      let workspace = this.get('workspace');
      const utils = this.get('utils');
      if (!utils.isNonEmptyObject(user)) {
        return;
      }
      const permissions = this.get('workspace.permissions');

      if (utils.isNonEmptyArray(permissions)) {
        const objToRemove = permissions.findBy('user', user.get('id'));
        if (objToRemove) {
          this.get('alert').showModal('warning', `Are you sure you want to remove ${user.get('username')} as a collaborator?`, `This may affect their ability to access ${this.get('workspace.name')} `, 'Yes, remove')
        .then((result) => {
          if (result.value) {
            permissions.removeObject(objToRemove);
            const collaborators = this.get('originalCollaborators');
            collaborators.removeObject(user);
            workspace.save().then(() => {
              this.get('alert').showToast('success', `${user.get('username')} removed`, 'bottom-end', 3000, null, false);
            });
          }
        });
        }
      }
    },
  }
});
