import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  classNames: ['workspace-list-item'],
  alert: service('sweet-alert'),
  permissions: service('workspace-permissions'),
  menuOptions: alias('parentView.moreMenuOptions'),

  ellipsisMenuOptions: computed(
    'workspace.id',
    'workspace.isTrashed',
    'currentUser.hiddenWorkspaces',
    function () {
      let ws = this.workspace;
      let currentUser = this.currentUser;
      let hiddenWorkspaces = currentUser.get('hiddenWorkspaces');
      let deleted = this.workspace.isTrashed;
      let canDelete = this.permissions.canDelete(ws);
      let canCopy = this.permissions.canCopy(ws);

      let moreMenuOptions = this.menuOptions;
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
        options = [
          {
            label: 'Restore',
            value: 'restore',
            action: 'restoreWorkspace',
            icon: 'fas fa-undo',
          },
        ];
      }

      return options;
    }
  ),

  actions: {
    toggleShowMoreMenu() {
      let isShowing = this.showMoreMenu;
      this.set('showMoreMenu', !isShowing);
    },

    deleteWorkspace: function () {
      let workspace = this.workspace;
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to delete this workspace?',
          null,
          'Yes, delete it'
        )
        .then((result) => {
          if (result.value) {
            workspace.set('isTrashed', true);
            workspace
              .save()
              .then((workspace) => {
                if (this.showMoreMenu) {
                  this.set('showMoreMenu', false);
                }
                this.alert
                  .showToast(
                    'success',
                    'Workspace Deleted',
                    'bottom-end',
                    5000,
                    true,
                    'Undo'
                  )
                  .then((result) => {
                    if (result.value) {
                      workspace.set('isTrashed', false);
                      workspace.save().then(() => {
                        this.alert.showToast(
                          'success',
                          'Workspace Restored',
                          'bottom-end',
                          3000,
                          false,
                          null
                        );
                        // window.history.back();
                      });
                    }
                  });
              })
              .catch((err) => {
                console.log('error', err);
              });
          }
        });
    },

    hideWorkspace: function () {
      let workspaceId = this.workspace.id;
      let user = this.currentUser;
      this.alert
        .showModal(
          'question',
          'Are you sure you want to hide this workspace?',
          'This will remove this workspace from your view, you can always restore this later',
          'Yes, hide it'
        )
        .then((result) => {
          if (result.value) {
            let hiddenWorkspaces = user.get('hiddenWorkspaces');
            hiddenWorkspaces.pushObject(workspaceId);
            user.set('hiddenWorkspaces', hiddenWorkspaces);
            user
              .save()
              .then((user) => {
                if (this.showMoreMenu) {
                  this.set('showMoreMenu', false);
                }
                this.alert
                  .showToast(
                    'success',
                    'Workspace Hidden',
                    'bottom-end',
                    5000,
                    true,
                    'Undo'
                  )
                  .then((result) => {
                    if (result.value) {
                      let hiddenWorkspaces = user.get('hiddenWorkspaces');
                      hiddenWorkspaces.removeObject(workspaceId);
                      user.set('hiddenWorkspaces', hiddenWorkspaces);
                      user.save().then(() => {
                        this.alert.showToast(
                          'success',
                          'Workspace Restored',
                          'bottom-end',
                          3000,
                          false,
                          null
                        );
                      });
                    }
                  });
              })
              .catch((err) => {
                console.log('error', err);
              });
          }
        });
    },

    restoreWorkspace: function () {
      let workspace = this.workspace;
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to restore this workspace?',
          null,
          'Yes, restore it'
        )
        .then((result) => {
          if (result.value) {
            workspace.set('isTrashed', false);
            workspace
              .save()
              .then(() => {
                if (this.showMoreMenu) {
                  this.set('showMoreMenu', false);
                }
                this.alert.showToast(
                  'success',
                  'Workspace Restored',
                  'bottom-end',
                  5000,
                  false,
                  null
                );
              })
              .catch((err) => {
                console.log('error', err);
              });
          }
        });
    },

    copyWorkspace: function () {
      let workspace = this.workspace;
      this.toCopyWorkspace(workspace);
    },
  },
});
