Encompass.WorkspaceInfoCollaboratorsComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: ['workspace-info-collaborators'],
  utils: Ember.inject.service('utility-methods'),
  alert: Ember.inject.service('sweet-alert'),
  globalPermissionValue: null,
  showCustom: Ember.computed.equal('globalPermissionValue', 'custom'),
  mainPermissions: [
    {
      id: 1,
      display: 'Hidden',
      value: 0,
    },
    {
      id: 2,
      display: 'View Only',
      value: 1,
    },
    {
      id: 3,
      display: 'Create',
      value: 2,
    },
    {
      id: 4,
      display: 'Edit',
      value: 3,
    },
    {
      id: 5,
      display: 'Delete',
      value: 4,
    },
  ],
  feedbackPermissions: [
    {
      id: 1,
      display: 'None',
      value: 'none',
    },
    {
      id: 2,
      display: 'Approval Required',
      value: 'authReq',
    },
    {
      id: 3,
      display: 'Pre-Approved',
      value: 'preAuth',
    },
    {
      id: 4,
      display: 'Approver',
      value: 'approver',
    },
  ],
  submissionPermissions: [
    {
      id: 1,
      display: 'All',
      value: 'all',
    },
    {
      id: 2,
      display: 'Own Only',
      value: 'userOnly',
    },
    {
      id: 3,
      display: 'Custom',
      value: 'custom',
    },
  ],

  modes: function () {
    const basic = ['private', 'org', 'public'];

    if (this.get('currentUser.isStudent') || !this.get('currentUser.isAdmin')) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];

  }.property('currentUser.isAdmin', 'currentUser.isStudent'),

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

  createValueObject(val) {
    let obj = {
      id: null,
      display: null,
      value: val,
    };
    switch (val) {
      case 0:
        obj.display = 'Hidden';
        obj.id = 1;
        break;
      case 1:
        obj.display = 'View Only';
        obj.id = 2;
        break;
      case 2:
        obj.display = 'Create';
        obj.id = 3;
        break;
      case 3:
        obj.display = 'Add';
        obj.id = 4;
        break;
      case 4:
        obj.display = 'Delete';
        obj.id = 5;
        break;
      case 'none':
        obj.display = 'None';
        obj.id = 1;
        break;
      case 'authReq':
        obj.display = 'Approval Required';
        obj.id = 2;
        break;
      case 'preAuth':
        obj.display = 'Pre-Approved';
        obj.id = 3;
        break;
      case 'approver':
        obj.display = 'Approver';
        obj.id = 4;
        break;
      default:
        break;
    }
    return obj;
  },

  createSubmissionValueObject(subObj) {
    let obj = {
      id: null,
      display: null,
      value: null,
    };
    if (subObj.all) {
      obj.id = 1;
      obj.value = 'all';
      obj.display = 'All';
    } else if (subObj.userOnly) {
      obj.id = 2;
      obj.value = 'userOnly';
      obj.display = 'Own Only';
    } else {
      obj.id = 3;
      obj.value = 'custom';
      obj.display = 'Custom';
      this.set('customSubIds', subObj.submissionIds);
    }
    return obj;
  },

  buildCustomSubmissionIds(submissionsValue) {
    if (submissionsValue === 'custom') {
      let ids = this.get('customSubmissionIds');
      if (this.get('utils').isNonEmptyArray(ids)) {
        return ids;
      }
      return [];
    }
    // } else if (submissionsValue === 'userOnly') {
    //   // filter for only submissions that have selectedUser as student
    //   const subs = this.get('workspace.submissions.content');
    //   const selectedUsername = this.get('selectedUser.username');
    //   const selectedUserId = this.get('selectedUser.id');
    //   if (subs) {
    //     const filtered = subs.filter((sub) => {
    //       return sub.get('creator.studentId') === selectedUserId || sub.get('creator.username') === selectedUsername;
    //     });
    //     return filtered.mapBy('id');
    //   }
    // }
    return [];
  },

  actions: {
    editCollab: function (collaborator) {
      this.set('isEditing', true);
      if (!this.get('utils').isNonEmptyObject(collaborator)) {
        return;
      }
      this.set('selectedCollaborator', collaborator.userObj);
      this.set('globalPermissionValue', collaborator.global);

      let submissions = this.createSubmissionValueObject(collaborator.submissions);
      let selections = this.createValueObject(collaborator.selections);
      let comments = this.createValueObject(collaborator.comments);
      let folders = this.createValueObject(collaborator.folders);
      let feedback = this.createValueObject(collaborator.feedback);
      let customSubIds = collaborator.submissions.submissionIds;
      this.set('submissions', submissions);
      this.set('customSubmissionIds', customSubIds);
      this.set('selections', selections);
      this.set('comments', comments);
      this.set('folders', folders);
      this.set('feedback', feedback);
    },

    savePermissions(permissionsObject) {
      const ws = this.get('workspace');
      if (!this.get('utils').isNonEmptyObject(permissionsObject)) {
        return;
      }
      const permissions = this.get('workspace.permissions');
      let existingObj = permissions.findBy('user', permissionsObject.user);

      this.set('selectedUser', permissionsObject.userObj);

      if (existingObj) {
        permissions.removeObject(existingObj);
      }

      let subValue = this.get('submissions.value');

      let newObj = {
        user: existingObj.user,
        global: this.get('globalPermissionValue'),
        submissions: {all: false, userOnly: false, submissionIds: []},
      };

      let globalSetting = this.get('globalPermissionValue');
        if (globalSetting === 'viewOnly') {
          newObj.folders = 1;
          newObj.selections = 1;
          newObj.comments = 1;
          newObj.feedback = 'none';
          newObj.submissions.all = true;
        }

        if (globalSetting === 'editor') {
          newObj.folders = 3;
          newObj.selections = 4;
          newObj.comments = 4;
          newObj.feedback = 'none';
          newObj.submissions.all = true;

        }

        if (globalSetting === 'indirectMentor') {
          newObj.folders = 2;
          newObj.selections = 2;
          newObj.comments = 2;
          newObj.feedback = 'authReq';
          newObj.submissions.all = true;

        }

        if (globalSetting === 'directMentor') {
          newObj.folders = 2;
          newObj.selections = 2;
          newObj.comments = 2;
          newObj.feedback = 'preAuth';
          newObj.submissions.all = true;

        }

        if (globalSetting === 'approver') {
          newObj.folders = 3;
          newObj.selections = 4;
          newObj.comments = 4;
          newObj.feedback = 'approver';
          newObj.submissions.all = true;

        }
        if (globalSetting === 'custom') {
          newObj.selections = this.get('selections.value');
          newObj.folders = this.get('folders.value');
          newObj.comments = this.get('comments.value');
          newObj.feedback = this.get('feedback.value');

          if (subValue === 'all') {
            newObj.submissions.all = true;
          } else if (subValue === 'userOnly') {
            newObj.submissions.userOnly = true;
          } else if (subValue === 'custom'){
            newObj.submissions.submissionIds = this.get('customSubmissionIds');
          }
        }
      permissions.addObject(newObj);

      ws.save().then(() => {
        this.set('globalPermissionValue', null);
        this.get('alert').showToast('success', `Permissions set for ${permissionsObject.userObj.get('username')}`, 'bottom-end', 3000, null, false);
        this.set('selectedCollaborator', null);
        this.set('selectedUser', null);
      });
    },

    removeCollab(user) {
      let workspace = this.get('workspace');
      const utils = this.get('utils');

      if (!utils.isNonEmptyObject(user)) {
        return;
      }
      const permissions = this.get('workspace.permissions');

      if (utils.isNonEmptyArray(permissions)) {
        const objToRemove = permissions.findBy('user', user.get('id'));
        if (objToRemove) {

          let userDisplay = user.get('username');
          let pronoun = 'their';

          let isSelf = user.get('id') === this.get('currentUser.id');

          if (isSelf) {
            userDisplay = 'yourself';
            pronoun = 'your';
          }

          this.get('alert').showModal('warning', `Are you sure you want to remove ${userDisplay} as a collaborator?`, `This may affect ${pronoun} ability to access ${this.get('workspace.name')} `, 'Yes, remove')
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

    addCollaborator: function() {
      this.set('createNewCollaborator', true);
    },
    toggleSubmissionView: function () {
      this.set('isShowingCustomViewer', !this.get('isShowingCustomViewer'));
    },
    cancelEditCollab: function() {
      this.set('selectedCollaborator', null);
      if (this.get('isShowingCustomViewer')) {
        this.set('isShowingCustomViewer', false);
      }
    },
    confirmRemoveSelf() {
      this.send('removeCollab', this.get('currentUser'));
    }
  }
});
