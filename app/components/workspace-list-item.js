/*global _:false */
Encompass.WorkspaceListItemComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  classNames: ['workspace-list-item'],
  alert: Ember.inject.service('sweet-alert'),

  permissions: Ember.inject.service('problem-permissions'),
  canEdit: Ember.computed.alias('writePermissions.canEdit'),
  canDelete: Ember.computed.alias('writePermissions.canDelete'),
  canAssign: Ember.computed.alias('writePermissions.canAssign'),
  menuOptions: Ember.computed.alias('parentView.moreMenuOptions'),
  parentData: Ember.computed.alias('parentView.containerData'),
  parentActions: Ember.computed.alias("parentView.containerActions"),



  didReceiveAttrs: function () {
    let problem = this.get('problem');
    this.set('writePermissions', this.get('permissions').writePermissions(problem));
  },

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
    let canDelete = this.get('canDelete');
    let canAssign = this.get('canAssign');
    let moreMenuOptions = this.get('menuOptions');
    let isAdmin = this.get('currentUser.isAdmin');
    let options = moreMenuOptions.slice();
    let deleted = this.get('workspace.isTrashed');

    if (!canDelete) {
      // dont show delete or edit option
      options = _.filter(moreMenuOptions, (option) => {
        return option.value !== 'edit' && option.value !== 'delete';
      });
    }

    if (isAdmin) {
      // if problem is approved, admins will have exposed Flag button so no need in more menu
    }

    // if (!isAdmin) {
    //   // remove any admin only options for non admins
    //   options = _.filter(options, (option) => {
    //     return !option.adminOnly;
    //   });
    //   if (status === "approved") {
    //     options = _.filter(options, (option) => {
    //       return !_.contains(['assign'], option.value);
    //     });
    //   }
    // }
    // if (status === 'pending') {
    //   // dont show pend or assign option if status is pending
    //   options = _.filter(options, (option) => {
    //     return !_.contains(['pending', 'assign'], option.value);
    //   });
    // }

    // if (status === 'flagged') {
    //   // dont show flag or assign if status is flagged
    //   options = _.filter(options, (option) => {
    //     return !_.contains(['flag', 'assign'], option.value);
    //   });
    // }

    if (deleted) {
      options = _.filter(options, (option) => {
        return !_.contains(['delete'], option.value);
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

    deleteProblem: function () {
      let problem = this.get('problem');
      this.get('alert').showModal('warning', 'Are you sure you want to delete this problem?', null, 'Yes, delete it')
        .then((result) => {
          if (result.value) {
            problem.set('isTrashed', true);
            // this.sendAction('toProblemList');
            problem.save().then((problem) => {
              if (this.get('showMoreMenu')) {
                this.set('showMoreMenu', false);
              }
              this.get('alert').showToast('success', 'Problem Deleted', 'bottom-end', 5000, true, 'Undo')
                .then((result) => {
                  if (result.value) {
                    problem.set('isTrashed', false);
                    problem.save().then(() => {
                      this.get('alert').showToast('success', 'Problem Restored', 'bottom-end', 3000, false, null);
                      // window.history.back();
                    });
                  }
                });
            }).catch((err) => {
              this.handleErrors(err, 'updateProblemErrors', problem);
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