import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  loading: service('loading-display'),

  defaultName: computed(
    'assignment.name',
    'section.name',
    'assignmentName',
    'sectionName',
    function () {
      let assignmentName = this.get('assignment.name') || this.assignmentName;
      let sectionName = this.get('section.name') || this.sectionName;

      return `${assignmentName} (${sectionName})`;
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

      assignment.linkedWorkspacesRequest = {
        ...assignment.linkedWorkspacesRequest,
        doAllowSubmissionUpdates: true,
        name: this.workspaceName || this.defaultName,
        doCreate: true,
      };

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
