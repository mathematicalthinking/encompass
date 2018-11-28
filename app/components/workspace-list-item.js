/*global _:false */
Encompass.WorkspaceListItemComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['workspace-list-item'],
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  menuOptions: Ember.computed.alias('parentView.moreMenuOptions'),
  parentData: Ember.computed.alias('parentView.containerData'),
  parentActions: Ember.computed.alias("parentView.containerActions"),

  isPublic: function () {
    return this.get('privacySetting') === 'E';
  }.property('problem.privacySetting'),

  isOrg: function () {
    return this.get('privacySetting') === 'O';
  }.property('problem.privacySetting'),

  isPrivate: function () {
    return this.get('privacySetting') === 'M';
  }.property('problem.privacySetting'),


  ellipsisMenuOptions: function () {
    let ws = this.get('workspace');
    let deleted = this.get('workspace.isTrashed');

    let canDelete = this.get('permissions').canDelete(ws);
    let canCopy = this.get('permissions').canCopy(ws);
    // let canAssign = this.get('canAssign');
    // let canHide = this.get('canAssign');
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

    return options;
  }.property('workspace.id', 'workspace.isTrashed'),


  actions: {
    toggleShowMoreMenu() {
      let isShowing = this.get('showMoreMenu');
      this.set('showMoreMenu', !isShowing);
    },

    restoreProblem: function () {
      let problem = this.get('problem');
      this.get('alert').showModal('warning', 'Are you sure you want to restore this problem?', null, 'Yes, restore')
        .then((result) => {
          if (result.value) {
            problem.set('isTrashed', false);
            problem.save().then(() => {
              this.get('alert').showToast('success', 'Problem Restored', 'bottom-end', 3000, false, null);
              let parentData = this.get('parentData');
              this.get('parentActions.refreshList').call(parentData);
            });
          }
        });
    },

    deleteWorkspace: function () {
      console.log('deleteWorkspace Called');
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

    assignProblem() {
      // this.set('creatingAssignment', true);
      // send to parent to handle?
      let problem = this.get('problem');
      problem.set('isForAssignment', true);
      this.send('toProblemInfo', problem);

    },

    editProblem() {
      // send to parent to handle?
      let problem = this.get('problem');
      problem.set('isForEdit', true);
      this.send('toProblemInfo', problem);
    },

    toProblemInfo(problem) {
      this.get('toProblemInfo')(problem);
    },

  }

});