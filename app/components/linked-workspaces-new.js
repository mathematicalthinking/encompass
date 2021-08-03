import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  elementId: 'linked-workspaces-new',
  loading: service('loading-display'),

  didReceiveAttrs() {
    this.set('workspaceName', this.defaultName);
  },

  defaultName: computed(
    'assignment.name',
    'section.name',
    'assignmentName',
    'sectionName',
    function () {
      let assignmentName = this.assignment.name || this.assignmentName;
      let sectionName = this.section.name || this.sectionName;

      return `${assignmentName} (${sectionName})`;
    }
  ),

  previewName: computed('defaultName', 'workspaceName', function () {
    return this.workspaceName || this.defaultName;
  }),

  actions: {
    cancel() {
      if (this.onCancel) {
        this.onCancel();
      } else {
        this.set('isCreating', false);
      }
    },
    create() {
      let assignment = this.assignment;

      if (!assignment) {
        return;
      }

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isRequestInProgress',
        'doShowLoadingMessage'
      );

      let data = {
        doAllowSubmissionUpdates: true,
        name: this.workspaceName || this.defaultName,
        doCreate: true,
      };

      assignment.set('linkedWorkspacesRequest', data);

      assignment.set('parentWorkspaceRequest', { doCreate: false });
      return assignment
        .save()
        .then((assignment) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isRequestInProgress',
            'doShowLoadingMessage'
          );

          let createWorkspaceError = assignment.get(
            'linkedWorkspacesRequest.error'
          );

          if (createWorkspaceError) {
            return this.set('createWorkspaceError', createWorkspaceError);
          }

          this.handleResults(assignment);
          this.send('cancel');
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'start',
            'isRequestInProgress',
            'doShowLoadingMessage'
          );

          this.set('createWorkspaceError', err);
        });
    },
  },
});
