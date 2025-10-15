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
  @tracked isQuillEmpty = false;
  @tracked isQuillTooLong = false;
  @tracked editRevisionText = '';
  @tracked editRevisionNote = '';
  @tracked isReplySending = false;
  @tracked doShowLoadingMessage = false;
  @tracked currentDisplayResponseId = null;

  quillEditorId = 'mentor-editor';
  maxResponseLength = 14680064;
  errorPropsToRemove = [
    'saveRecordErrors',
    'emptyReplyError',
    'quillTooLongError',
  ];
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
    if (!this.args.mentorReplies) return [];
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

  get quillTooLongErrorMsg() {
    const len = this.quillText.length;
    const maxSizeDisplay = this._returnSizeDisplay(this.maxResponseLength);
    const actualSizeDisplay = this._returnSizeDisplay(len);
    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
  }

  get isOldFormatDisplayResponse() {
    const text = this.args.displayResponse?.text;
    if (!text) return false;
    const parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(
      (node) => node.nodeType === 1
    );
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

  _getQuillErrors() {
    const errors = [];
    if (this.isQuillEmpty) errors.push('emptyReplyError');
    if (this.isQuillTooLong) errors.push('quillTooLongError');
    return errors;
  }

  _returnSizeDisplay(bytes) {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
  }

  _clearErrorProps() {
    this.errorHandling.removeMessages(...this.errorPropsToRemove);
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

    const quillErrors = this._getQuillErrors();
    if (quillErrors.length > 0) {
      quillErrors.forEach((errorProp) =>
        this.errorHandling.handleErrors(
          { errors: [{ detail: 'Please enter a response' }] },
          errorProp
        )
      );
      return;
    }

    this.args.displayResponse.text = this.quillText;
    this.args.displayResponse.note = this.editRevisionNote;

    let doSetSuperceded = false;
    const priorRevisionStatus = this.args.priorMentorRevision?.status;
    if (
      priorRevisionStatus === 'pendingApproval' ||
      priorRevisionStatus === 'needsRevisions'
    ) {
      doSetSuperceded = true;
      this.args.priorMentorRevision.status = 'superceded';
    }

    let newStatus = this.newReplyStatus;
    let toastMessage = 'Response Sent';

    if (newStatus === 'pendingApproval') {
      toastMessage = 'Response Sent for Approval';
    }
    if (isDraft) {
      newStatus = 'draft';
      toastMessage = 'Draft Saved';
    }

    this.args.displayResponse.status = newStatus;

    const promises = [this.args.displayResponse.save()];
    if (doSetSuperceded) {
      promises.push(this.args.priorMentorRevision.save());
    }

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );

    try {
      await Promise.all(promises);
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isReplySending',
        'doShowLoadingMessage'
      );
      this.alert.showToast(
        'success',
        toastMessage,
        'bottom-end',
        3000,
        false,
        null
      );
      this.isFinishingDraft = false;
      this.editRevisionText = '';
    } catch (err) {
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isReplySending',
        'doShowLoadingMessage'
      );
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

    const quillErrors = this._getQuillErrors();
    if (quillErrors.length > 0) {
      quillErrors.forEach((errorProp) =>
        this.errorHandling.handleErrors(
          { errors: [{ detail: 'Please enter a response' }] },
          errorProp
        )
      );
      return;
    }

    const oldText = this.args.displayResponse?.text;
    const newText = this.quillText;
    const oldNote = this.args.displayResponse?.note;
    const newNote = this.editRevisionNote;

    if (oldText === newText && oldNote === newNote) {
      this.isEditing = false;
      return;
    }

    this.args.displayResponse.text = newText;
    this.args.displayResponse.note = newNote;

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );

    try {
      await this.args.displayResponse.save();
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isReplySending',
        'doShowLoadingMessage'
      );
      this.alert.showToast(
        'success',
        'Response Updated',
        'bottom-end',
        3000,
        false,
        null
      );
      this.isEditing = false;
      this.editRevisionText = '';
    } catch (err) {
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isReplySending',
        'doShowLoadingMessage'
      );
      this.errorHandling.handleErrors(err, 'saveRecordErrors');
    }
  }

  @action
  async saveRevision(isDraft) {
    this._clearErrorProps();

    const quillErrors = this._getQuillErrors();
    if (quillErrors.length > 0) {
      quillErrors.forEach((errorProp) =>
        this.errorHandling.handleErrors(
          { errors: [{ detail: 'Please enter a response' }] },
          errorProp
        )
      );
      return;
    }

    const oldText = this.args.displayResponse?.text;
    const newText = this.quillText;
    const oldNote = this.args.displayResponse?.note;
    const newNote = this.editRevisionNote;

    if (!isDraft && oldText === newText && oldNote === newNote) {
      this.isRevising = false;
      return;
    }

    const oldStatus = this.args.displayResponse?.status;
    const doSetSuperceded =
      !isDraft &&
      (oldStatus === 'pendingApproval' || oldStatus === 'needsRevisions');

    const copy = this.args.displayResponse.toJSON({ includeId: false });
    delete copy.approvedBy;
    delete copy.lastModifiedDate;
    delete copy.lastModifiedBy;
    delete copy.comments;
    delete copy.selections;
    delete copy.wasReadByRecipient;
    delete copy.wasReadByApprover;

    copy.text = newText;
    copy.note = newNote;
    copy.createDate = new Date();

    let newReplyStatus = this.newReplyStatus;
    if (isDraft) newReplyStatus = 'draft';

    const revision = this.store.createRecord('response', copy);
    revision.createdBy = this.currentUser.user;
    revision.submission = this.args.submission;
    revision.workspace = this.args.workspace;
    revision.priorRevision = this.args.displayResponse;
    revision.recipient = this.args.displayResponse?.recipient?.content;
    revision.status = newReplyStatus;

    const toastMessage = isDraft ? 'Draft Saved' : 'Revision Sent';

    if (doSetSuperceded) {
      this.args.displayResponse.status = 'superceded';
    }

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );

    try {
      const promises = [revision.save()];
      if (doSetSuperceded) {
        promises.push(this.args.displayResponse.save());
      }
      const [savedRevision] = await Promise.all(promises);
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isReplySending',
        'doShowLoadingMessage'
      );
      this.alert.showToast(
        'success',
        toastMessage,
        'bottom-end',
        3000,
        false,
        null
      );
      this.isRevising = false;
      this.editRevisionText = '';
      this.setDisplayMentorReply(savedRevision);
      this.args.handleResponseThread?.(savedRevision, 'mentor');
    } catch (err) {
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isReplySending',
        'doShowLoadingMessage'
      );
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
    this.args.toNewResponse?.();
  }

  @action
  handleNewMentorReply(response, threadType) {
    this.args.handleResponseThread?.(response, threadType);
  }

  @action
  updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
  }
}
