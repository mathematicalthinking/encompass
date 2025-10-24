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
  @tracked primaryResponse = null;
  @tracked currentSubmissionId = null;
  @tracked revisedBriefSummary = '';
  @tracked revisedExplanation = '';

  revisionsToolTip =
    'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)';

  constructor() {
    super(...arguments);
    this._initializeSubmission();
    this._initializePrimaryResponse();
  }

  _initializeSubmission() {
    if (this.args.submission?.id !== this.currentSubmissionId) {
      this.currentSubmissionId = this.args.submission?.id;
      this.isRevising = false;
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

  get answerAssignment() {
    return this.args.submission?.answer?.assignment;
  }

  get answerContent() {
    return this.args.submission?.answer;
  }

  get answerSection() {
    return this.args.submission?.answer?.section;
  }

  get answerProblem() {
    return this.args.submission?.answer?.problem;
  }

  get quillStartingText() {
    return this.args.submission?.answer?.explanation || '';
  }

  get sortedStudentSubmissions() {
    return this.args.studentSubmissions?.sortBy('createDate') || [];
  }

  get workspacesToUpdateIds() {
    return [this.args.workspace?.id];
  }

  get mentoredRevisions() {
    const studentSubmissions = this.args.studentSubmissions || [];
    return studentSubmissions.filter((sub) => {
      let responseIds = this.utils.getHasManyIds(sub, 'responses');
      return this.args.wsResponses?.find((response) => {
        return responseIds.includes(response.id);
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
