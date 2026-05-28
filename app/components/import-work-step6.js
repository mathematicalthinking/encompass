import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class ImportWorkStep6Component extends Component {
  get selectedProblem() {
    return this.args.selectedProblem || null;
  }

  get selectedSection() {
    return this.args.selectedSection || null;
  }

  get submissionCount() {
    return this.args.submissionCount || 0;
  }

  get workspaceName() {
    return this.args.workspaceName || null;
  }

  get workspaceOwner() {
    return this.args.workspaceOwner || null;
  }

  get workspaceMode() {
    return this.args.workspaceMode || null;
  }

  get folderSet() {
    return this.args.folderSet || null;
  }

  get assignmentName() {
    return this.args.assignmentName || null;
  }

  get savingAssignment() {
    return this.args.savingAssignment === true;
  }

  get isUploadingAnswer() {
    return this.args.isUploadingAnswer === true;
  }

  get isCreatingWorkspace() {
    return this.args.isCreatingWorkspace === true;
  }

  get uploadedAnswers() {
    return this.args.uploadedAnswers === true;
  }

  get createdWorkspace() {
    return this.args.createdWorkspace || null;
  }

  get createWorkspaceError() {
    return this.args.createWorkspaceError || null;
  }

  get createdAssignment() {
    return this.args.createdAssignment || null;
  }

  get showLoadingMessage() {
    return (
      this.isUploadingAnswer ||
      this.isCreatingWorkspace ||
      this.savingAssignment
    );
  }

  get shouldHideButtons() {
    return (
      this.isUploadingAnswer ||
      this.isCreatingWorkspace ||
      this.savingAssignment ||
      this.uploadedAnswers
    );
  }

  get workspaceLink() {
    const createdWorkspace = this.createdWorkspace;
    const workspaceId = createdWorkspace?._id;
    if (!workspaceId) {
      return '/#/workspaces';
    }

    const firstSubmissionId = createdWorkspace?.submissions?.[0];
    if (!firstSubmissionId) {
      return `/#/workspaces/${workspaceId}/work`;
    }

    return `/#/workspaces/${workspaceId}/submissions/${firstSubmissionId}`;
  }

  get createDate() {
    return this.args.createDate || null;
  }

  @action
  next() {
    if (typeof this.args.onProceed === 'function') {
      this.args.onProceed();
    }
  }

  @action
  back() {
    if (typeof this.args.onBack === 'function') {
      this.args.onBack(-1);
    }
  }
}
