/*global _:false */
Encompass.WorkspaceInfoCollaboratorsNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: ['workspace-info-collaborators-new'],
  utils: Ember.inject.service('utility-methods'),
  alert: Ember.inject.service('sweet-alert'),
  globalPermissionValue: 'viewOnly',
  showCustom: Ember.computed.equal('globalPermissionValue', 'custom'),
  mainPermissions: [{
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
  feedbackPermissions: [{
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
    }
  ],
  submissionPermissions: [{
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
    } else if (submissionsValue === 'userOnly') {
      // filter for only submissions that have selectedUser as student
      const subs = this.get('workspace.submissions.content');
      const selectedUsername = this.get('collabUser.username');
      const selectedUserId = this.get('collabUser.id');
      if (subs) {
        const filtered = subs.filter((sub) => {
          return sub.get('creator.studentId') === selectedUserId || sub.get('creator.username') === selectedUsername;
        });
        return filtered.mapBy('id');
      }
    }
    return [];
  },

  actions: {
    setCollab(val, $item) {
      if (!val) {
        return;
      }
      let existingCollab = this.get('workspace.collaborators');
      const user = this.get('store').peekRecord('user', val);
      let alreadyCollab = _.contains(existingCollab, user.get('id'));

      if (alreadyCollab) {
        this.set('existingUserError', true);
        return;
      }
      if (this.get('utils').isNonEmptyObject(user)) {
        this.set('collabUser', user);
      }
    },

    saveCollab() {
      if (!this.get('collabUser')) {
        this.set('missingUserError', true);
        return;
      }
      let ws = this.get('workspace');
      let permissions = ws.get('permissions');

      let subValue = this.get('submissions.value');
      let viewAllSubs;
      let submissionIds = [];
      if (subValue === 'all') {
        viewAllSubs = true;
      } else if (subValue === 'userOnly') {
        viewAllSubs = false;
        submissionIds = this.buildCustomSubmissionIds('userOnly');
      } else if (subValue === 'custom') {
        viewAllSubs = false;
        submissionIds = this.get('customSubmissionIds');
      } else {
        viewAllSubs = true;
      }

      let newObj = {
        user: this.get('collabUser.id'),
        submissions: {
          all: viewAllSubs,
          submissionIds: submissionIds
        },
        global: this.get('globalPermissionValue'),
      };

      let globalSetting = this.get('globalPermissionValue');

      if (globalSetting === 'viewOnly') {
        newObj.folders = 1;
        newObj.selections = 1;
        newObj.comments = 1;
        newObj.feedback = 'none';

      }

      if (globalSetting === 'editor') {
        newObj.folders = 3;
        newObj.selections = 4;
        newObj.comments = 4;
        newObj.feedback = 'none';

      }

      if (globalSetting === 'indirectMentor') {
        newObj.folders = 2;
        newObj.selections = 2;
        newObj.comments = 2;
        newObj.feedback = 'authReq';

      }

      if (globalSetting === 'directMentor') {
        newObj.folders = 2;
        newObj.selections = 2;
        newObj.comments = 2;
        newObj.feedback = 'preAuth';

      }

      if (globalSetting === 'approver') {
        newObj.folders = 3;
        newObj.selections = 4;
        newObj.comments = 4;
        newObj.feedback = 'approver';

      }
      if (globalSetting === 'custom') {
        newObj.selections = this.get('selections.value') || 0;
        newObj.folders = this.get('folders.value') || 0;
        newObj.comments = this.get('comments.value') || 0;
        newObj.feedback = this.get('feedback.value') || 'none';
      }
      this.get('originalCollaborators').addObject(this.get('collabUser'));

      permissions.addObject(newObj);

      ws.save().then(() => {
        this.get('alert').showToast('success', `${this.get('collabUser').get('username')} added as collaborator`, 'bottom-end', 3000, null, false);
        this.set('createNewCollaborator', false);
        this.set('isShowingCustomViewer', false);
      });
    },
    toggleSubmissionView: function () {
      this.set('isShowingCustomViewer', !this.get('isShowingCustomViewer'));
    }
  }
});
