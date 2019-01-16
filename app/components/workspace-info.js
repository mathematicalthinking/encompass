Encompass.WorkspaceInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'workspace-info',
  comments: Ember.inject.controller,
  alert: Ember.inject.service('sweet-alert'),
  permissions: Ember.inject.service('workspace-permissions'),
  utils: Ember.inject.service('utility-methods'),
  isEditing: false,
  selectedMode: null,
  updateRecordErrors: [],
  isShowingCustomViewer: false,
  customSubmissionIds: [],

  didReceiveAttrs() {
    this._super(...arguments);

    const collaborators = this.get('workspace.collaborators');
    // array of Ids, query for users;

    if (!this.get('utils').isNonEmptyArray(collaborators)) {
      this.set('originalCollaborators', []);
      return;
    }

    return this.get('store').query('user', {
      ids: collaborators
    })
    .then((users) => {
      this.set('originalCollaborators', users.toArray());
    })
    .catch((err) => {
      this.handleErrors(err, 'queryErrors');
    });
  },

  willDestroyElement: function () {
    let workspace = this.get('workspace');
    workspace.save();
    this._super(...arguments);
  },

  canEdit: Ember.computed('workspace.id', function () {
    let workspace = this.get('workspace');
    let ownerId = workspace.get('owner.id');
    let creatorId = workspace.get('createdBy.id');
    let currentUser = this.get('currentUser');
    let accountType = currentUser.get('accountType');
    let isAdmin = accountType === "A";
    let isOwner = ownerId === currentUser.id;
    let isCreator = creatorId === currentUser.id;

    return isAdmin || isOwner || isCreator;
  }),

  modes: function () {
    const basic = ['private', 'org', 'public'];

    if (this.get('currentUser.isStudent') || !this.get('currentUser.isAdmin')) {
      return basic;
    }

    return ['private', 'org', 'public', 'internet'];

  }.property('currentUser.isAdmin', 'currentUser.isStudent'),

  actions: {
    removeCollab(user) {
      const utils = this.get('utils');
      if (!utils.isNonEmptyObject(user)) {
        return;
      }
      const permissions = this.get('workspacePermissions');

      if (utils.isNonEmptyArray(permissions)) {
        const objToRemove = permissions.findBy('user', user.id);
        if (objToRemove) {
          this.get('alert').showModal('warning', `Are you sure you want to remove ${user.get('username')} as a collaborator?`, `This may affect their ability to access ${this.get('workspace.name')} `, 'Yes, remove.')
        .then((result) => {
          if (result.value) {
            permissions.removeObject(objToRemove);
            const collaborators = this.get('originalCollaborators');
            collaborators.removeObject(user);
            // this.get('alert').showToast('success', `${user.get('username')} removed`, 'bottom-end', 3000, null, false);
            // remove workspace from user's collab workspaces
          }
        });
        }
      }
    },
    savePermissions(permissionsObject) {
      if (!this.get('utils').isNonEmptyObject(permissionsObject)) {
        return;
      }
      const permissions = this.get('workspacePermissions');

      // array of user records for display purposes
      const collaborators = this.get('originalCollaborators');
      // check if user already is in array
      let existingObj = permissions.findBy('user', permissionsObject.user.id);

      // remove existing permissions obj and add modified one
      if (existingObj) {
        permissions.removeObject(existingObj);
      }
      collaborators.addObject(permissionsObject.user);

      // eslint-disable-next-line prefer-object-spread
      let copy = Object.assign({}, permissionsObject);

      copy.user = copy.user.id;
      permissions.addObject(copy);

      // clear selectedCollaborator
      // clear selectize input

      this.set('selectedCollaborator', null);
      this.$('select#collab-select')[0].selectize.clear();

      this.get('alert').showToast('success', `Permissions set for ${permissionsObject.user.get('username')}`, 'bottom-end', 3000, null, false);
     },

    editCollab: function(user) {
      if (!this.get('utils').isNonEmptyObject(user)) {
        return;
      }
      this.set('selectedCollaborator', user);
    },

    editOwner: function () {
      this.set('isChangingOwner', true);
    },

    editWorkspace: function () {
      this.set('isEditing', true);
      let workspace = this.get('workspace');
      this.set('selectedMode', workspace.get('mode'));
    },

    checkWorkspace: function () {
      let workspace = this.get('workspace');
      let workspaceOrg = workspace.get('organization.content');
      let workspaceOwner = workspace.get('owner');
      let ownerOrg = workspaceOwner.get('organization');
      let ownerOrgName = ownerOrg.get('name');
      let mode = this.get('selectedMode');
      workspace.set('mode', mode);
      if (mode === 'org' && workspaceOrg === null) {
        this.get('alert').showModal('info', `Do you want to make this workspace visibile to ${ownerOrgName}`, `Everyone in this organization will be able to see this workspace`, 'Yes', 'No').then((results) => {
          if (results.value) {
            workspace.set('organization', ownerOrg);
            this.send('saveWorkspace');
          }
        });
      } else {
        this.send('saveWorkspace');
      }
    },

    saveWorkspace: function () {
      this.set('isEditing', false);
      let workspace = this.get('workspace');
      workspace.save().then((res) => {
        this.get('alert').showToast('success', 'Workspace Updated', 'bottom-end', 3000, null, false);
      }).catch((err) => {
        this.handleErrors(err, 'updateRecordErrors', workspace);
      });
    },

    removeErrorString: function(arrayPropName, errorString) {
      let errors = this.get(arrayPropName);
      if (Array.isArray(errors)) {
        errors.removeObject(errorString);
      }
    }
  }

});



