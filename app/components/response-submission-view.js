import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ResponseSubmissionViewComponent extends Component {
  @service('utility-methods') utils;
  @service currentUser;
  @service store;

  @tracked isShortExpanded = true;
  @tracked isLongExpanded = true;
  @tracked isImageExpanded = false;
  @tracked isUploadExpanded = false;
  @tracked isRevising = false;
  @tracked submissionList = [];
  @tracked primaryResponse = null;
  @tracked currentSubmissionId = null;
  @tracked revisedBriefSummary = '';
  @tracked revisedExplanation = '';
  @tracked contributors = [];

  revisionsToolTip =
    'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)';

  constructor() {
    super(...arguments);
    this._initializeSubmission();
    this._initializeSubmissionList();
    this._initializePrimaryResponse();
  }

  _initializeSubmission() {
    if (this.args.submission?.id !== this.currentSubmissionId) {
      this.currentSubmissionId = this.args.submission?.id;
      this.isRevising = false;
    }
  }

  _initializeSubmissionList() {
    if (this.args.studentSubmissions) {
      this.submissionList = this.args.studentSubmissions;
    }
  }

  _initializePrimaryResponse() {
    if (this.args.response) {
      if (this.primaryResponse?.id !== this.args.response.id) {
        this.primaryResponse = this.args.response;
      }
    }
  }

  get isOwnSubmission() {
    return (
      this.args.submission?.creator?.studentId === this.currentUser.user?.id
    );
  }

  get canRevise() {
    return !this.args.isParentWorkspace && this.isOwnSubmission;
  }

  get showButton() {
    return this.canRevise;
  }

  get displaySubmission() {
    return this.args.submission;
  }

  get sortedStudentSubmissions() {
    return this.submissionList.sortBy('createDate');
  }

  get workspacesToUpdateIds() {
    return [this.args.workspace?.id];
  }

  get mentoredRevisions() {
    return this.submissionList.filter((sub) => {
      let responseIds = this.utils.getHasManyIds(sub, 'responses');
      return this.args.wsResponses?.find((response) => {
        return responseIds.includes(response.get('id'));
      });
    });
  }

  @action
  toggleProperty(p) {
    this[p] = !this[p];
  }

  @action
  startRevising() {
    if (!this.isRevising) {
      this.revisedBriefSummary = this.args.submission?.answer?.answer;
      this.isRevising = true;
    }
  }

  @action
  cancelRevising() {
    if (this.isRevising) {
      this.isRevising = false;
      this.revisedBriefSummary = '';
      this.revisedExplanation = '';
    }
  }

  @action
  insertQuillContent(selector, options) {
    if (!this.isRevising) {
      return;
    }
    const quill = new window.Quill(selector, options);

    let explanation = this.args.submission?.answer?.explanation;
    let students = this.args.submission?.answer?.students;
    this.contributors = students?.map((s) => s);

    if (explanation) {
      // Use the Quill instance properly instead of manually manipulating the DOM
      quill.root.innerHTML = explanation;
    }
  }

  @action
  async toSubmissionFromAnswer(answer) {
    try {
      const sub = await this.store.queryRecord('submission', {
        filterBy: {
          answer: answer.id,
        },
      });

      this.cancelRevising();

      // NOTE: sendRevisionNotices is broken (pre-existing comment from Classic Ember)
      // TODO: This notification logic should be moved to backend. Leaving as-is for now in this migration.
      this.args.sendRevisionNotices?.(this.args.submission, sub);
      this.args.onSubChange?.(sub);
    } catch (error) {
      this.cancelRevising();
      console.error('Failed to load submission from answer:', error);
    }
  }

  @action
  setDisplaySubmission(sub) {
    this.args.onSubChange?.(sub);
  }
}
