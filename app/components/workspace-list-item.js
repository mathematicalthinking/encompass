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
  store: service(),
  ellipsisMenuOptions: computed(
    'workspace.id',
    'workspace.isTrashed',
    'currentUser.hiddenWorkspaces',
    function () {
      let ws = this.workspace;
      let currentUser = this.currentUser;
      let hiddenWorkspaces = currentUser.get('hiddenWorkspaces');
      let deleted = this.get('workspace.isTrashed');
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
    async assignWorkspace(){
      let sections = await this.store.findAll('section');
      let workspace = this.get('workspace');
      let workspaceName = this.get('workspace.name');
      let options = {};
      for(let section of sections.toArray()){
        options[section.id] = section.name;
      }
      this.get('alert').showPromptSelect('Assign Workspace to class', options, "Choose a class")
        .then((res)=>{
          if(res.value){
            this.get('store').findRecord('section', res.value).then((section)=>{
              Promise.all(section.get("students").map((student)=>student.get('displayName'))).then((displayNames)=>{
                Promise.all(section.get("students").map((student, index)=>{
                  let copyWorkspaceRequest = {
                    createDate: new Date(),
                    isTrashed: false,
                    lastModifiedDate: new Date(),
                    name: `${displayNames[index] || "Copy of"}: ${workspaceName}`,
                    mode: 'private',
                    submissionOptions: { all: true },
                    folderOptions: { folderSetOptions: { doCreateFolderSet: false }, none: true },
                    selectionOptions: { none: true },
                    commentOptions: { none: true },
                    responseOptions: { none: true },
                    permissionOptions: {},
                    copyWorkspaceError: null,
                    createdBy: this.get('currentUser'),
                    lastModifiedBy: this.get('currentUser'),
                    owner: student,
                    originalWsId: workspace,
                    createdWorkspace: null,
                    createdFolderSet: null
                  };
                  let copyRequest = this.get('store').createRecord('copyWorkspaceRequest', copyWorkspaceRequest);
                  return copyRequest.save();
                })).then((results) => {
                  let errors = results.filter((result)=>result.get('copyWorkspaceError')).map((result)=>result.get('copyWorkspaceError'));
                  if(results.some((result)=>result.get('copyWorkspaceError'))){
                    this.get('alert').showToast('error', errors[0], 'bottom-end', 5000);
                  } else {
                    this.get('alert').showToast('success', 'Workspaces Created', 'bottom-end', 5000);
                  }
                })
                .catch((err) => {
                  this.get('alert').showToast('error', 'Workspace Error', 'bottom-end', 5000);
                  console.log(err);
                });
              });
          });
          }
        });
    },
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
      let workspaceId = this.get('workspace.id');
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
