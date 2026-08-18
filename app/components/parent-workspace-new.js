import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class ParentWorkspaceNewComponent extends Component {
  @service('loading-display') loading;
  @service currentUser;
  @tracked isRequestInProgress = false;
  @tracked doShowLoadingMessage = false;
  @tracked workspaceName = '';
  @tracked isCreating = true;
  @tracked createWorkspaceError = null;

  constructor() {
    super(...arguments);
    this.workspaceName = this.defaultName;
  }

  get defaultName() {
    let base = 'Parent Workspace:';
    let assignmentName = this.args.assignmentName || this.args.assignment.name;

    if (assignmentName) {
      return `${base} ${assignmentName} (${
        this.args.sectionName || this.args.section.name
      })`;
    }

    return base + this.currentUser.user.username;
  }

  @action cancel() {
    if (this.args.onCancel) {
      this.args.onCancel();
    } else {
      this.isCreating = false;
    }
  }
  @action create() {
    let childWorkspaces = this.args.childWorkspaces || [];
    if (childWorkspaces.length === 0) {
      this.createWorkspaceError =
        'Must provide child workspaces to create parent workspace';
      return;
    }

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isRequestInProgress',
      'doShowLoadingMessage'
    );

    let assignment = this.args.assignment;
    let data = {
      childWorkspaces: childWorkspaces.map((ws) => ws.id),
      doAutoUpdateFromChildren: true,
      name: this.workspaceName || this.defaultName,
      doCreate: true,
    };

    assignment.parentWorkspaceRequest = data;

    // make sure linked workspaces request is not set to create
    assignment.linkedWorkspacesRequest = { doCreate: false };
    return assignment
      .save()
      .then((results) => {
        this.loading.handleLoadingMessage(
          this,
          'end',
          'isRequestInProgress',
          'doShowLoadingMessage'
        );

        let createWorkspaceError = results.parentWorkspaceRequest?.error;
        let createdWorkspace = results.parentWorkspaceRequest?.createdWorkspace;

        if (createWorkspaceError) {
          this.createWorkspaceError = createWorkspaceError;
          return;
        }

        this.args.handleResults?.(createdWorkspace);
        this.cancel();
      })
      .catch((err) => {
        this.loading.handleLoadingMessage(
          this,
          'end',
          'isRequestInProgress',
          'doShowLoadingMessage'
        );
        this.createWorkspaceError = err;
      });
  }

  @action
  resetCreateWorkspaceError() {
    this.createWorkspaceError = null;
  }
}
