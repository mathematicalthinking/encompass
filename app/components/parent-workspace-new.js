Encompass.ParentWorkspaceNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'parent-workspace-new',
  loading: Ember.inject.service('loading-display'),

  isRequestInProgess: false,
  doShowLoadingMessage: false,

  didReceiveAttrs() {
    this.set('workspaceName', this.get('defaultName'));
  },

  defaultName: function() {
    let base = 'Parent Workspace: ';
    let assignmentName = this.get('assignment.name');

    if (assignmentName) {
      return base + assignmentName;
    }

    return base + this.get('currentUser.username');
  }.property('assignment.name', 'currentUser.username'),

  actions: {
    cancel() {
      if (this.get('onCancel')) {
        this.get('onCancel')();
      } else {
        this.set('isCreating', false);
      }
    },
    create() {
      let childWorkspaces = this.get('childWorkspaces') || [];
      if (!childWorkspaces) {
        return this.set('createWorkspaceError', 'Must provide child workspaces to create parent workspace');
      }

      this.get('loading').handleLoadingMessage(this, 'start', 'isRequestInProgress', 'doShowLoadingMessage');

      let assignment = this.get('assignment');
      let data = {
        childWorkspaces: childWorkspaces.mapBy('id'),
        doAutoUpdateFromChildren: true,
        name: this.get('workspaceName') || this.get('defaultName'),
        doCreate: true,
      };

      assignment.set('parentWorkspaceRequest', data);

      // make sure linked workspaces request is not set to create
      assignment.set('linkedWorkspacesRequest', { doCreate: false });
      return assignment.save()
        .then((results) => {
          this.get('loading').handleLoadingMessage(this, 'end', 'isRequestInProgress', 'doShowLoadingMessage');

          let createWorkspaceError = results.get('parentWorkspaceRequest.error');
          let createdWorkspace = results.get('parentWorkspaceRequest.createdWorkspace');

          if (createWorkspaceError) {
            return this.set('createWorkspaceError', createWorkspaceError);
          }

          this.get('handleResults')(createdWorkspace);
          this.send('cancel');
        })
        .catch((err) => {
          this.get('loading').handleLoadingMessage(this, 'end', 'isRequestInProgress', 'doShowLoadingMessage');
          this.set('createWorkspaceError', err);
        });
    }
  }
});