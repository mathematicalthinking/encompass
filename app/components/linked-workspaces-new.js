import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class LinkedWorkspacesNew extends Component {
  @service('loading-display') loading;
  @tracked workspaceName = '';
  @tracked isCreating = true;
  constructor() {
    super(...arguments);
    this.workspaceName = this.defaultName;
  }

  get defaultName() {
    let assignmentName = this.args.assignmentName || this.args.assignment.name;
    let sectionName = this.args.sectionName || this.args.section.name;

    return `${assignmentName} (${sectionName})`;
  }

  get previewName() {
    return this.workspaceName || this.defaultName;
  }

  @action cancel() {
    if (this.args.onCancel) {
      this.args.onCancel();
    } else {
      this.isCreating = false;
    }
  }
  @action create() {
    let assignment = this.args.assignment;

    if (!assignment) {
      return;
    }

    // this.loading.handleLoadingMessage(
    //   this,
    //   'start',
    //   'isRequestInProgress',
    //   'doShowLoadingMessage'
    // );

    assignment.linkedWorkspacesRequest = {
      ...assignment.linkedWorkspacesRequest,
      doAllowSubmissionUpdates: true,
      name: this.workspaceName || this.defaultName,
      doCreate: true,
    };

    assignment.parentWorkspaceRequest = { doCreate: false };
    return assignment
      .save()
      .then((assignment) => {
        // this.loading.handleLoadingMessage(
        //   this,
        //   'end',
        //   'isRequestInProgress',
        //   'doShowLoadingMessage'
        // );

        let createWorkspaceError = assignment.get(
          'linkedWorkspacesRequest.error'
        );

        if (createWorkspaceError) {
          return (this.createWorkspaceError = createWorkspaceError);
        }

        this.args.handleResults(assignment);
        this.cancel();
      })
      .catch((err) => {
        // this.loading.handleLoadingMessage(
        //   this,
        //   'start',
        //   'isRequestInProgress',
        //   'doShowLoadingMessage'
        // );

        this.createWorkspaceError = err;
      });
  }
}
