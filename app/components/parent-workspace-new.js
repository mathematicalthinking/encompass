Encompass.ParentWorkspaceNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'parent-workspace-new',

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
      let data = {
        owner : this.get('currentUser'),
        createdBy : this.get('currentUser'),
        childWorkspaces: childWorkspaces.mapBy('id'),
        mode : 'private',
        doAutoUpdateFromChildren: true,
        name: this.get('workspaceName') || this.get('defaultName'),
        linkedAssignment: this.get('assignment'),
      };

      let requestRecord = this.get('store').createRecord('parentWorkspaceRequest', data);

      return requestRecord.save()
        .then((results) => {
          console.log('results', results);
          let createWorkspaceError = results.get('createWorkspaceError');
          let createdWorkspace = results.get('createdWorkspace');

          if (createWorkspaceError) {
            return this.set('createWorkspaceError', createWorkspaceError);
          }

          this.get('handleResults')(createdWorkspace);
          this.send('cancel');
        })
        .catch((err) => {
          this.set('createWorkspaceError', err);
        });
    }
  }
});