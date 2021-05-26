/*global _:false */
Encompass.WorkspaceListItemComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['workspace-list-item'],
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  menuOptions: Ember.computed.alias('parentView.moreMenuOptions'),

// for the three dot button in grid menu
  ellipsisMenuOptions: function () {
    let ws = this.get('workspace');
    let currentUser = this.get('currentUser');
    let hiddenWorkspaces = currentUser.get('hiddenWorkspaces');
    let deleted = this.get('workspace.isTrashed');
    let canDelete = this.get('permissions').canDelete(ws);
    let canCopy = this.get('permissions').canCopy(ws);

    let moreMenuOptions = this.get('menuOptions');
    let options = moreMenuOptions.slice();

    if (!canDelete || deleted) {
      options = _.filter(options, (option) => {
        return option.value !== 'delete';
      });
    }

    if (!canCopy) {
      options = _.filter(options, (option) => {
        return option.value !== 'copy';
      });
    }

    if (hiddenWorkspaces.length >= 1) {
      let wsId = ws.get('id');
      if (hiddenWorkspaces.includes(wsId)) {
        options = _.filter(options, (option) => {
          return option.value !== 'hide';
        });
      }
    }

    if (deleted) {
      options = [{label: 'Restore', value: 'restore', action: 'restoreWorkspace', icon: 'fas fa-undo'}];
    }


    return options;
  }.property('workspace.id', 'workspace.isTrashed', 'currentUser.hiddenWorkspaces'),


  actions: {
    toggleShowMoreMenu() {
      let isShowing = this.get('showMoreMenu');
      this.set('showMoreMenu', !isShowing);
    },

    deleteWorkspace: function () {
      let workspace = this.get('workspace');
      this.get('alert').showModal('warning', 'Are you sure you want to delete this workspace?', null, 'Yes, delete it')
        .then((result) => {
          if (result.value) {
            workspace.set('isTrashed', true);
            workspace.save().then((workspace) => {
              if (this.get('showMoreMenu')) {
                this.set('showMoreMenu', false);
              }
              this.get('alert').showToast('success', 'Workspace Deleted', 'bottom-end', 5000, true, 'Undo')
                .then((result) => {
                  if (result.value) {
                    workspace.set('isTrashed', false);
                    workspace.save().then(() => {
                      this.get('alert').showToast('success', 'Workspace Restored', 'bottom-end', 3000, false, null);
                      // window.history.back();
                    });
                  }
                });
            }).catch((err) => {
              console.log('error', err);
            });
          }
        });
    },

    hideWorkspace: function () {
      let workspaceId = this.get('workspace.id');
      let user = this.get('currentUser');
      this.get('alert').showModal('question', 'Are you sure you want to hide this workspace?', 'This will remove this workspace from your view, you can always restore this later', 'Yes, hide it')
        .then((result) => {
          if (result.value) {
            let hiddenWorkspaces = user.get('hiddenWorkspaces');
            hiddenWorkspaces.pushObject(workspaceId);
            user.set('hiddenWorkspaces', hiddenWorkspaces);
            user.save().then((user) => {
              if (this.get('showMoreMenu')) {
                this.set('showMoreMenu', false);
              }
              this.get('alert').showToast('success', 'Workspace Hidden', 'bottom-end', 5000, true, 'Undo')
                .then((result) => {
                  if (result.value) {
                    let hiddenWorkspaces = user.get('hiddenWorkspaces');
                    hiddenWorkspaces.removeObject(workspaceId);
                    user.set('hiddenWorkspaces', hiddenWorkspaces);
                    user.save().then(() => {
                      this.get('alert').showToast('success', 'Workspace Restored', 'bottom-end', 3000, false, null);
                    });
                  }
                });
            }).catch((err) => {
              console.log('error', err);
            });
          }
        });
    },

    restoreWorkspace: function () {
      let workspace = this.get('workspace');
      this.get('alert').showModal('warning', 'Are you sure you want to restore this workspace?', null, 'Yes, restore it')
        .then((result) => {
          if (result.value) {
            workspace.set('isTrashed', false);
            workspace.save().then(() => {
              if (this.get('showMoreMenu')) {
                this.set('showMoreMenu', false);
              }
              this.get('alert').showToast('success', 'Workspace Restored', 'bottom-end', 5000, false, null);
            }).catch((err) => {
              console.log('error', err);
            });
          }
        });
    },

    copyWorkspace: function () {
      let workspace = this.get('workspace');
      this.get('toCopyWorkspace')(workspace);
    },

  }

});