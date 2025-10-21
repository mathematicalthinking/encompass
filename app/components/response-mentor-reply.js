import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ResponseMentorReplyComponent extends Component {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service('loading-display') loading;
  @service errorHandling;
  @service navigation;
  @service currentUser;
  @service store;

  @tracked isRevising = false;
  @tracked isEditing = false;
  @tracked isFinishingDraft = false;
  @tracked quillText = '';
  @tracked isValidQuillContent = true;
  @tracked editRevisionText = '';
  @tracked editRevisionNote = '';
  @tracked isReplySending = false;
  @tracked doShowLoadingMessage = false;
  @tracked currentDisplayResponseId = null;

  errorPropsToRemove = ['saveRecordErrors'];
  revisionsToolTip = 'Replies are sorted from oldest to newest, left to right.';

  constructor() {
    super(...arguments);
    this.currentDisplayResponseId = this.args.displayResponse?.id;
  }

  // NOTE: The following properties/getters are unused because they reference parent @args that are not being passed:
  // - revisionsToolTip, showEdit, showRevise, showResumeDraft, showTrash, replyHeadingText, statusIconFill, showStatus
  // Keeping implementation for now because there is commented-out template code that needs further discussion.
  // See commented sections in response-mentor-reply.hbs

  get statusIconFill() {
    return this.args.iconFillOptions?.[this.args.displayResponse?.status];
  }

  _checkResponseChange() {
    const responseId = this.args.displayResponse?.id;
    if (responseId !== this.currentDisplayResponseId) {
      this.currentDisplayResponseId = responseId;
      this.isEditing = false;
      this.isRevising = false;
      this.isFinishingDraft = false;
    }
  }

  get showStatus() {
    return this.args.canApprove || this.args.isOwnMentorReply;
  }

  get newReplyStatus() {
    return this.args.canDirectSend ? 'approved' : 'pendingApproval';
  }

  get canRevise() {
    return !this.args.isParentWorkspace && this.args.isOwnMentorReply;
  }

  get canEdit() {
    return (
      !this.args.isParentWorkspace &&
      this.args.displayResponse?.status === 'pendingApproval' &&
      (this.args.canApprove || this.args.isOwnMentorReply)
    );
  }

  get isComposing() {
    this._checkResponseChange();
    return this.isEditing || this.isRevising || this.isFinishingDraft;
  }

  get showEdit() {
    return this.canEdit && !this.isComposing;
  }

  get isDraft() {
    return this.args.displayResponse?.status === 'draft';
  }

  get showRevise() {
    return this.canRevise && !this.isDraft && !this.isComposing;
  }

  get showResumeDraft() {
    return this.args.isOwnMentorReply && this.isDraft && !this.isComposing;
  }

  get responseNewModel() {
    return this.args.isCreating
      ? this.args.response
      : this.args.displayResponse;
  }

  get replyHeadingText() {
    if (this.isEditing) return 'Editing Mentor Reply';
    if (this.isRevising) return 'New Revision';
    return '';
  }

  get showApproverNoteInput() {
    return this.isComposing && this.newReplyStatus !== 'approved';
  }

  get sortedMentorReplies() {
    if (!this.args.submissionResponses) return [];
    const currentStudent = this.args.submission?.student;
    return (
      this.args.submissionResponses
        ?.filter((reply) => currentStudent === reply.get('submission.student')) // used .get to avoid async issues
        .sortBy('createDate')
        .reverse() || []
    );
  }

  get showNoteHeader() {
    return this.showApproverNoteInput || this.showDisplayNote;
  }

  get showDisplayNote() {
    if (
      this.isComposing ||
      (!this.args.isOwnMentorReply && !this.args.canApprove)
    ) {
      return false;
    }
    const note = this.args.displayResponse?.note;
    return typeof note === 'string' && note.length > 0;
  }

  get canTrash() {
    const status = this.args.displayResponse?.status;
    if (this.args.isParentWorkspace) return false;
    return (
      status === 'draft' ||
      (status === 'pendingApproval' &&
        (this.args.isOwnMentorReply || this.args.canApprove))
    );
  }

  get showTrash() {
    return this.canTrash && !this.isComposing;
  }

  get canSendNew() {
    return (
      !this.args.isParentWorkspace &&
      this.args.canSend &&
      !this.args.isOwnSubmission
    );
  }

  get sendButtonText() {
    return this.args.canDirectSend ? 'Send' : 'Submit for Approval';
  }

  get saveButtonText() {
    return this.isEditing ? 'Save' : this.sendButtonText;
  }

  get showSaveDraftButton() {
    return this.isRevising || this.isFinishingDraft;
  }

  get recipientReadUnreadIcon() {
    if (this.args.displayResponse?.wasReadByRecipient) {
      return {
        className: 'far fa-envelope-open',
        title: 'Recipient has seen message',
      };
    }
    return {
      className: 'far fa-envelope',
      title: 'Recipient has not seen message',
    };
  }

  get showRecipientReadUnread() {
    return (
      this.args.displayResponse?.status === 'approved' &&
      !this.args.isMentorRecipient
    );
  }

  _hasContentChanged(oldText, newText, oldNote, newNote) {
    return oldText !== newText || oldNote !== newNote;
  }

  _startLoading() {
    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );
  }

  _endLoading() {
    this.loading.handleLoadingMessage(
      this,
      'end',
      'isReplySending',
      'doShowLoadingMessage'
    );
  }

  _showSuccessToast(message) {
    this.alert.showToast('success', message, 'bottom-end', 3000, false, null);
  }

  _resetEditState() {
    this.editRevisionText = '';
  }

  _clearErrorProps() {
    this.errorHandling.removeMessages(...this.errorPropsToRemove);
  }

  _shouldSupersede(status) {
    return status === 'pendingApproval' || status === 'needsRevisions';
  }

  _createRevisionCopy() {
    const copy = this.args.displayResponse.toJSON({ includeId: false });
    delete copy.approvedBy;
    delete copy.lastModifiedDate;
    delete copy.lastModifiedBy;
    delete copy.comments;
    delete copy.selections;
    delete copy.wasReadByRecipient;
    delete copy.wasReadByApprover;
    return copy;
  }

  _buildRevisionRecord(copy, newText, newNote, status) {
    copy.text = newText;
    copy.note = newNote;
    copy.createDate = new Date();

    const revision = this.store.createRecord('response', copy);
    revision.createdBy = this.currentUser.user;
    revision.submission = this.args.submission;
    revision.workspace = this.args.workspace;
    revision.priorRevision = this.args.displayResponse;
    revision.recipient = this.args.displayResponse?.recipient?.content;
    revision.status = status;

    return revision;
  }

  @action
  onSaveSuccess(submission, response) {
    this.args.onSaveSuccess?.(submission, response);
  }

  @action
  handleComposeAction(propName, value, doClearErrors) {
    if (value) {
      this.editRevisionText = this.args.displayResponse?.text || '';
      this.editRevisionNote = this.args.displayResponse?.note || '';
    } else {
      this.editRevisionText = '';
      this.editRevisionNote = '';
    }
    this[propName] = value;
    if (doClearErrors) this._clearErrorProps();
  }

  @action
  async saveDraft(isDraft) {
    this._clearErrorProps();

    if (!this.isValidQuillContent) return;

    this.args.displayResponse.text = this.quillText;
    this.args.displayResponse.note = this.editRevisionNote;

    const priorRevisionStatus = this.args.priorMentorRevision?.status;
    const doSetSuperceded = this._shouldSupersede(priorRevisionStatus);

    if (doSetSuperceded) {
      this.args.priorMentorRevision.status = 'superceded';
    }

    const newStatus = isDraft ? 'draft' : this.newReplyStatus;
    const toastMessage = isDraft
      ? 'Draft Saved'
      : newStatus === 'pendingApproval'
      ? 'Response Sent for Approval'
      : 'Response Sent';

    this.args.displayResponse.status = newStatus;

    const promises = [this.args.displayResponse.save()];
    if (doSetSuperceded) {
      promises.push(this.args.priorMentorRevision.save());
    }

    this._startLoading();

    try {
      await Promise.all(promises);
      this._endLoading();
      this._showSuccessToast(toastMessage);
      this.isFinishingDraft = false;
      this._resetEditState();
    } catch (err) {
      this._endLoading();
      this.errorHandling.handleErrors(
        err,
        'saveRecordErrors',
        this.args.displayResponse
      );
    }
  }

  @action
  async saveEdit() {
    this._clearErrorProps();

    if (!this.isValidQuillContent) return;

    const oldText = this.args.displayResponse?.text;
    const oldNote = this.args.displayResponse?.note;

    if (
      !this._hasContentChanged(
        oldText,
        this.quillText,
        oldNote,
        this.editRevisionNote
      )
    ) {
      this.isEditing = false;
      return;
    }

    this.args.displayResponse.text = this.quillText;
    this.args.displayResponse.note = this.editRevisionNote;

    this._startLoading();

    try {
      await this.args.displayResponse.save();
      this._endLoading();
      this._showSuccessToast('Response Updated');
      this.isEditing = false;
      this._resetEditState();
    } catch (err) {
      this._endLoading();
      this.errorHandling.handleErrors(err, 'saveRecordErrors');
    }
  }

  @action
  async saveRevision(isDraft) {
    this._clearErrorProps();

    if (!this.isValidQuillContent) return;

    const oldText = this.args.displayResponse?.text;
    const oldNote = this.args.displayResponse?.note;

    if (
      !isDraft &&
      !this._hasContentChanged(
        oldText,
        this.quillText,
        oldNote,
        this.editRevisionNote
      )
    ) {
      this.isRevising = false;
      return;
    }

    const oldStatus = this.args.displayResponse?.status;
    const doSetSuperceded = !isDraft && this._shouldSupersede(oldStatus);

    const copy = this._createRevisionCopy();
    const newReplyStatus = isDraft ? 'draft' : this.newReplyStatus;
    const revision = this._buildRevisionRecord(
      copy,
      this.quillText,
      this.editRevisionNote,
      newReplyStatus
    );

    const toastMessage = isDraft ? 'Draft Saved' : 'Revision Sent';

    if (doSetSuperceded) {
      this.args.displayResponse.status = 'superceded';
    }

    this._startLoading();

    try {
      const promises = [revision.save()];
      if (doSetSuperceded) {
        promises.push(this.args.displayResponse.save());
      }
      const [savedRevision] = await Promise.all(promises);
      this._endLoading();
      this._showSuccessToast(toastMessage);
      this.isRevising = false;
      this._resetEditState();
      this.setDisplayMentorReply(savedRevision);
      this.args.handleResponseThread?.(savedRevision, 'mentor');
    } catch (err) {
      this._endLoading();
      this.errorHandling.handleErrors(err, 'saveRecordErrors', null, [
        revision,
        this.args.displayResponse,
      ]);
    }
  }

  @action
  setDisplayMentorReply(response) {
    if (!response) return;
    this.args.onMentorReplySwitch?.(response);
  }

  @action
  async confirmTrash(response) {
    if (!response) return;

    const result = await this.alert.showModal(
      'warning',
      'Are you sure you want to delete this response?',
      '',
      'Delete'
    );

    if (!result.value) return;

    try {
      response.isTrashed = true;
      await response.save();
      this.alert.showToast(
        'success',
        'Response Deleted',
        'bottom-end',
        3000,
        false,
        null
      );
      const prevResponse =
        this.sortedMentorReplies[this.sortedMentorReplies.length - 1] || null;
      this.args.onSaveSuccess?.(this.args.submission, prevResponse);
    } catch (err) {
      this.errorHandling.handleErrors(err, 'recordSaveErrors', response);
    }
  }

  @action
  toNewResponse() {
    this.navigation.toNewResponse(
      this.args.submission.id,
      this.args.workspace.id
    );
  }

  @action
  handleNewMentorReply(response, threadType) {
    this.args.handleResponseThread?.(response, threadType);
  }

  @action
  updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isValidQuillContent = !isEmpty && !isOverLengthLimit;
  }

  @action
  cancelCompose() {
    this.editRevisionText = '';
    this.editRevisionNote = '';
    this.isEditing = false;
    this.isRevising = false;
    this.isFinishingDraft = false;
  }

  @action
  async saveResponse(isDraft = false) {
    if (this.isEditing) {
      return this.saveEdit();
    } else if (this.isRevising) {
      return this.saveRevision(isDraft);
    } else if (this.isFinishingDraft) {
      return this.saveDraft(isDraft);
    }
  }
}
