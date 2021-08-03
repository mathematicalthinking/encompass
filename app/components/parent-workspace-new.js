import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  tagName: '',
  elementId: 'parent-workspace-new',
  loading: service('loading-display'),

  isRequestInProgess: false,
  doShowLoadingMessage: false,

  didReceiveAttrs() {
    this._super();
    this.set('workspaceName', this.defaultName);
  },

  defaultName: computed(
    'assignment.name',
    'currentUser.username',
    'assignmentName',
    function () {
      let base = 'Parent Workspace: ';
      let assignmentName = this.assignment.name || this.assignmentName;

      if (assignmentName) {
        return base + assignmentName;
      }

      return base + this.currentUser.username;
    }
  ),

  actions: {
    cancel() {
      if (this.onCancel) {
        this.onCancel();
      } else {
        this.set('isCreating', false);
      }
    },
    create() {
      let childWorkspaces = this.childWorkspaces || [];
      if (!childWorkspaces) {
        return this.set(
          'createWorkspaceError',
          'Must provide child workspaces to create parent workspace'
        );
      }

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isRequestInProgress',
        'doShowLoadingMessage'
      );

      let assignment = this.assignment;
      let data = {
        childWorkspaces: childWorkspaces.mapBy('id'),
        doAutoUpdateFromChildren: true,
        name: this.workspaceName || this.defaultName,
        doCreate: true,
      };

      assignment.set('parentWorkspaceRequest', data);

      // make sure linked workspaces request is not set to create
      assignment.set('linkedWorkspacesRequest', { doCreate: false });
      return assignment
        .save()
        .then((results) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isRequestInProgress',
            'doShowLoadingMessage'
          );

          let createWorkspaceError = results.get(
            'parentWorkspaceRequest.error'
          );
          let createdWorkspace = results.get(
            'parentWorkspaceRequest.createdWorkspace'
          );

          if (createWorkspaceError) {
            return this.set('createWorkspaceError', createWorkspaceError);
          }

          this.handleResults(createdWorkspace);
          this.send('cancel');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isRequestInProgress',
            'doShowLoadingMessage'
          );
          this.set('createWorkspaceError', err);
        });
    },
  },
});
