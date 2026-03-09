import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import DOMPurify from 'dompurify';

export default class ResponseMentorReplyComponent extends Component {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service('loading-display') loading;
  @service errorHandling;
  @service navigation;
  @service currentUser;
  @service store;
  @service('ai-draft') aiDraft;

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
  @tracked editingReplyId = null;
  @tracked aiGeneratedText = null;
  @tracked quillKey = 0;
  @tracked variantComposeText = '';
  @tracked isSavingFinalEdit = false;
  @tracked latestBroughtDownVariantLogId = null;
  @tracked latestBroughtDownRequestId = null;
  @tracked latestBroughtDownVariantKey = null;

  maxResponseLength = 14680064;

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
    // Don't call _checkResponseChange during rendering - it causes reactivity issues
    // The check will happen in actions instead
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

  showResumeDraftForReply = (reply) => {
    if (this.args.isParentWorkspace) return false;
    const createdById = this.utils.getBelongsToId(reply, 'createdBy');
    const currentUserId = this.currentUser.user?.id;
    const isOwnReply = createdById === currentUserId;
    const isDraft = reply.status === 'draft';
    const isBeingEdited =
      this.isFinishingDraft && this.editingReplyId === reply.id;
    return isOwnReply && isDraft && !isBeingEdited;
  };

  isEditingThisDraft = (reply) => {
    return this.isFinishingDraft && this.editingReplyId === reply.id;
  };

  canReviseReply = (reply) => {
    if (this.args.isParentWorkspace) return false;
    const isOwnReply =
      this.utils.getBelongsToId(reply, 'createdBy') ===
      this.currentUser.user?.id;
    const isDraft = reply.status === 'draft';
    const isBeingEdited = this.isRevising && this.editingReplyId === reply.id;
    return isOwnReply && !isDraft && !isBeingEdited;
  };

  isRevisingThisReply = (reply) => {
    return this.isRevising && this.editingReplyId === reply.id;
  };

  isDraftReply = (reply) => {
    return reply.status === 'draft';
  };

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
    const rawResponses = this.args.submissionResponses;
    const responses = Array.isArray(rawResponses)
      ? rawResponses
      : rawResponses?.toArray?.() || [];
    const mentorReplies = responses.filter(
      (reply) => reply?.responseType === 'mentor' && !reply?.isTrashed
    );

    if (mentorReplies.length === 0) {
      return [];
    }

    return mentorReplies
      .slice()
      .sort(
        (a, b) => new Date(a?.createDate || 0) - new Date(b?.createDate || 0)
      );
  }

  get finalEditHistoryEntries() {
    const submission = this.args.submission;
    if (!submission) {
      return [];
    }
    const currentUserId = this._normalizeObjectId(this.currentUser.user);
    if (!currentUserId) {
      return [];
    }
    const userNameById = this._buildUserNameByIdMap();

    const rawVersions = submission.aiFinalEditVersions;
    const versions = Array.isArray(rawVersions)
      ? rawVersions
      : rawVersions?.toArray?.() || [];
    const ownVersions = versions.filter(
      (version) => this._normalizeObjectId(version?.savedBy) === currentUserId
    );

    let normalized = ownVersions
      .map((version, index) => {
        const html = this._toSafeHistoryHtml(version?.text || '');
        const { savedBy, savedById } = this._resolveSavedByDisplay(
          version?.savedBy,
          userNameById
        );
        const savedAtRaw = version?.savedAt || null;
        const savedAtDate = savedAtRaw ? new Date(savedAtRaw) : null;
        const savedAt =
          savedAtDate && !Number.isNaN(savedAtDate.getTime())
            ? savedAtDate
            : null;

        return {
          id: `${savedAt?.getTime() || 'no-date'}-${index}`,
          html,
          savedAt,
          savedBy,
          savedById,
        };
      })
      .filter((entry) => entry.html || entry.savedAt);

    const legacySavedById = this._normalizeObjectId(submission.aiFinalEditBy);
    if (
      normalized.length === 0 &&
      legacySavedById === currentUserId &&
      (submission.aiFinalEditText || submission.aiFinalEditAt)
    ) {
      const fallbackSavedAt = submission.aiFinalEditAt
        ? new Date(submission.aiFinalEditAt)
        : null;
      normalized = [
        {
          id: 'legacy-final-edit',
          html: this._toSafeHistoryHtml(submission.aiFinalEditText || ''),
          ...this._resolveSavedByDisplay(
            submission.aiFinalEditBy,
            userNameById
          ),
          savedAt:
            fallbackSavedAt && !Number.isNaN(fallbackSavedAt.getTime())
              ? fallbackSavedAt
              : null,
        },
      ];
    }

    return normalized.sort((a, b) => {
      const aMs = a.savedAt ? a.savedAt.getTime() : Number.POSITIVE_INFINITY;
      const bMs = b.savedAt ? b.savedAt.getTime() : Number.POSITIVE_INFINITY;
      return aMs - bMs;
    });
  }

  get hasPreviousConversation() {
    return (
      this.sortedMentorReplies.length > 0 ||
      this.finalEditHistoryEntries.length > 0
    );
  }

  get showNoteHeader() {
    return this.showApproverNoteInput || this.showDisplayNote;
  }

  get hasDrafts() {
    const responses = this.args.submissionResponses;

    // Handle PromiseManyArray - convert to plain array
    const responsesArray = Array.isArray(responses)
      ? responses
      : responses?.toArray?.() || [];

    if (responsesArray.length === 0) {
      return true; // Assume drafts exist until data loads
    }

    const result = responsesArray.some(
      (reply) =>
        reply.responseType === 'mentor' &&
        !reply.isTrashed &&
        reply.status === 'draft'
    );

    return result;
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

  canTrashReply = (reply) => {
    if (this.args.isParentWorkspace) return false;
    const isOwnReply =
      this.utils.getBelongsToId(reply, 'createdBy') ===
      this._normalizeObjectId(this.currentUser.user);
    const status = reply.status;
    const isBeingEdited =
      this.isFinishingDraft && this.editingReplyId === reply.id;
    return (
      ((status === 'draft' && isOwnReply) ||
        (status === 'pendingApproval' &&
          (isOwnReply || this.args.canApprove))) &&
      !isBeingEdited
    );
  };

  get canSendNew() {
    return (
      !this.args.isParentWorkspace &&
      this.args.canSend &&
      !this.args.isOwnSubmission &&
      !this.args.isOlderRevision
    );
  }

  get aiButtonTooltip() {
    if (!this.args.submission)
      return 'AI draft generation requires a valid submission';
    if (!this.aiDraft.hasStudentWork(this.args.submission))
      return 'AI draft generation requires student work (answers or explanations)';
    return 'Generate AI draft based on student work';
  }

  get aiButtonDisabled() {
    return (
      !this.args.submission ||
      !this.aiDraft.hasStudentWork(this.args.submission)
    );
  }

  get sendButtonText() {
    return this.args.canDirectSend ? 'Send' : 'Submit for Approval';
  }

  get saveButtonText() {
    return this.isEditing ? 'Save' : this.sendButtonText;
  }

  get showSaveDraftButton() {
    return this.isRevising;
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

  get canSaveFinalEditVersion() {
    return (
      Boolean(this.args.submission?.id) &&
      !this.isSavingFinalEdit &&
      !this._isEmptyEditorContent(this.quillText) &&
      this.isValidQuillContent
    );
  }

  get saveFinalEditButtonText() {
    return this.isSavingFinalEdit ? 'Saving...' : 'Save Final Edit Version';
  }

  _toSafeHistoryHtml(content) {
    if (!content) return '';

    const raw = String(content);

    if (/<\/?[a-z][\s\S]*>/i.test(raw)) {
      return DOMPurify.sanitize(raw);
    }

    return raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\r?\n/g, '<br>');
  }

  _buildUserNameByIdMap() {
    const names = new Map();
    const add = (id, name) => {
      if (!id || !name || names.has(id)) return;
      names.set(id, name);
    };

    const currentUserId = this._normalizeObjectId(this.currentUser.user);
    add(currentUserId, this._getUserDisplayName(this.currentUser.user));

    const rawReplies = this.sortedMentorReplies;
    const replies = Array.isArray(rawReplies)
      ? rawReplies
      : rawReplies?.toArray?.() || [];

    for (const reply of replies) {
      const createdById =
        this.utils.getBelongsToId(reply, 'createdBy') ||
        this._normalizeObjectId(reply?.createdBy);
      add(createdById, this._getUserDisplayName(reply?.createdBy));
    }

    return names;
  }

  _resolveSavedByDisplay(savedByValue, userNameById) {
    const directName = this._getUserDisplayName(savedByValue);
    const savedById = this._normalizeObjectId(savedByValue);
    const currentUserId = this._normalizeObjectId(this.currentUser.user);

    // Show saver identity only for rows saved by the current logged-in user.
    if (savedById && currentUserId && savedById !== currentUserId) {
      return { savedBy: null, savedById };
    }

    if (directName) {
      return { savedBy: directName, savedById };
    }

    if (savedById && userNameById?.has(savedById)) {
      return { savedBy: userNameById.get(savedById), savedById };
    }

    if (savedById) {
      const userRecord = this.store.peekRecord('user', savedById);
      const recordName = this._getUserDisplayName(userRecord);
      if (recordName) {
        return { savedBy: recordName, savedById };
      }
    }

    return { savedBy: savedById || null, savedById };
  }

  _normalizeObjectId(value) {
    if (!value) return null;
    if (typeof value === 'string') return value;

    if (typeof value === 'object') {
      const id = typeof value.get === 'function' ? value.get('id') : value.id;
      if (typeof id === 'string') return id;

      const rawId =
        typeof value.get === 'function' ? value.get('_id') : value._id;
      if (typeof rawId === 'string') return rawId;
      if (rawId && typeof rawId.toString === 'function') {
        return rawId.toString();
      }
    }

    return null;
  }

  _getUserDisplayName(userLike) {
    if (!userLike || typeof userLike === 'string') return null;

    const read = (key) => {
      if (typeof userLike.get === 'function') {
        return userLike.get(key);
      }
      return userLike[key];
    };

    return (
      read('safeName') ||
      read('fullName') ||
      read('displayName') ||
      read('username') ||
      null
    );
  }

  _hasContentChanged(oldText, newText, oldNote, newNote) {
    return oldText !== newText || oldNote !== newNote;
  }

  _isEmptyEditorContent(content) {
    if (!content) return true;

    const normalized = content.replace(/\s+/g, '').toLowerCase();
    return (
      normalized === '' ||
      normalized === '<p><br></p>' ||
      normalized === '<div><br></div>' ||
      normalized === '<p></p>'
    );
  }

  _headlineForVariant(variantKey) {
    if (variantKey === 'A') return 'Variant A';
    if (variantKey === 'D') return 'Variant B';
    return 'AI Draft';
  }

  _withDraftHeadline(draftText, variantKey = null) {
    const headline = this._headlineForVariant(variantKey);
    return `<p><strong>${headline}</strong></p><p><br></p>${draftText}`;
  }

  _mergeDraftIntoEditor(existingContent, draftText, variantKey = null) {
    const block = this._withDraftHeadline(draftText, variantKey);
    if (this._isEmptyEditorContent(existingContent)) {
      return block;
    }

    return `${existingContent}<p><br></p>${block}`;
  }

  _escapeDraftLine(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/ {2,}/g, (spaces) => '&nbsp;'.repeat(spaces.length));
  }

  _prepareDraftForEditor(draftText) {
    if (!draftText) return '';
    const raw = String(draftText);

    // Preserve existing HTML drafts, but sanitize before inserting.
    if (/<\/?[a-z][\s\S]*>/i.test(raw)) {
      return DOMPurify.sanitize(raw);
    }

    // Plain text path: preserve each input line as its own paragraph so Quill
    // does not collapse lines or drop metadata/list lines on append.
    const lines = raw.replace(/\r\n/g, '\n').split('\n');
    const html = lines
      .map((line) => {
        if (line.trim() === '') {
          return '<p><br></p>';
        }
        return `<p>${this._escapeDraftLine(line)}</p>`;
      })
      .join('');

    return html;
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
  async generateAIDraft() {
    if (
      !this.args.submission ||
      !this.aiDraft.hasStudentWork(this.args.submission)
    ) {
      this.alert.showToast(
        'info',
        'Cannot generate AI draft: No student work found. AI drafts require student answers or explanations to analyze.',
        'bottom-end',
        6000,
        false,
        null
      );
      return;
    }

    this._startLoading();
    try {
      const draft = await this.aiDraft.generateDraft(
        this.args.submission.id,
        'D',
        this.args.workspace?.id
      );
      this.aiGeneratedText = draft;
      this.quillKey++;
      this.editRevisionText = draft;
      let isEmpty = draft.trim() === '' || draft === '<p><br></p>';
      let isOverLimit = draft.length > this.maxResponseLength;
      this.updateQuillText(draft, isEmpty, isOverLimit);
      this.alert.showToast(
        'success',
        'AI draft generated successfully',
        'bottom-end',
        3000,
        false,
        null
      );
    } catch (error) {
      this.alert.showToast(
        'error',
        error.message || 'Failed to generate AI draft',
        'bottom-end',
        5000,
        false,
        null
      );
    } finally {
      this._endLoading();
    }
  }

  @action
  onSaveSuccess(submission, response) {
    this.args.onSaveSuccess?.(submission, response);
  }

  @action
  handleComposeAction(reply, propName, value, doClearErrors) {
    if (value) {
      this.editRevisionText = reply?.text || '';
      this.editRevisionNote = reply?.note || '';
      this.editingReplyId = reply?.id;
    } else {
      this.editRevisionText = '';
      this.editRevisionNote = '';
      this.editingReplyId = null;
    }
    this[propName] = value;
    if (doClearErrors) this._clearErrorProps();
  }

  @action
  async saveDraft(isDraft) {
    this._clearErrorProps();

    if (!this.isValidQuillContent) return;

    const editingReply = this.editingReplyId
      ? this.store.peekRecord('response', this.editingReplyId)
      : this.args.displayResponse;

    if (!editingReply) return;

    editingReply.text = this.quillText;
    editingReply.note = this.editRevisionNote;

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

    editingReply.status = newStatus;

    const promises = [editingReply.save()];
    if (doSetSuperceded) {
      promises.push(this.args.priorMentorRevision.save());
    }

    this._startLoading();

    try {
      const [savedResponse] = await Promise.all(promises);
      this._endLoading();
      this._showSuccessToast(toastMessage);
      this.isFinishingDraft = false;
      this.editingReplyId = null;
      this._resetEditState();

      if (!isDraft) {
        this.args.onSaveSuccess?.(this.args.submission, savedResponse);
      }
    } catch (err) {
      this._endLoading();
      this.errorHandling.handleErrors(err, 'saveRecordErrors', editingReply);
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
      // Draft will be filtered out by sortedMentorReplies getter since it's now trashed
      // No navigation needed - the UI will update reactively
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
  editDraft(reply) {
    this.editRevisionText = reply.text || '';
    this.editRevisionNote = reply.note || '';
    this.editingReplyId = reply.id;
    this.isFinishingDraft = true;
  }

  @action
  reviseReply(reply) {
    this.editRevisionText = reply.text || '';
    this.editRevisionNote = reply.note || '';
    this.editingReplyId = reply.id;
    this.isRevising = true;
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
  updateVariantComposeText(content, isEmpty, isOverLengthLimit) {
    // Keep variantComposeText as the seed value for Quill only.
    // Quill emits onEditorChange during setup (did-insert); updating the same
    // tracked field here triggers Ember's "updated after use" assertion.
    this.updateQuillText(content, isEmpty, isOverLengthLimit);
  }

  @action
  async saveFinalEditVersion() {
    if (!this.canSaveFinalEditVersion) {
      return;
    }

    const submissionId = this.args.submission?.id;
    const savedAt = new Date();
    const savedBy = this._normalizeObjectId(this.currentUser.user);
    const appendedVersion = {
      text: this.quillText,
      savedAt,
      savedBy,
      sourceVariantLogId: this.latestBroughtDownVariantLogId,
      sourceRequestId: this.latestBroughtDownRequestId,
      sourceVariantKey: this.latestBroughtDownVariantKey,
    };
    const payload = {
      aiFinalEditText: this.quillText,
      aiFinalEditAt: savedAt,
      aiFinalEditBy: savedBy,
      appendAiFinalEditVersion: appendedVersion,
    };

    this.isSavingFinalEdit = true;
    try {
      const response = await fetch(`/api/submissions/${submissionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ submission: payload }),
      });

      if (!response.ok) {
        const raw = await response.text();
        throw new Error(raw || 'Failed to save final edit version');
      }

      this.args.submission.aiFinalEditText = payload.aiFinalEditText;
      this.args.submission.aiFinalEditAt = payload.aiFinalEditAt;
      this.args.submission.aiFinalEditBy = payload.aiFinalEditBy;
      const existingRawVersions = this.args.submission.aiFinalEditVersions;
      const existingVersions = Array.isArray(existingRawVersions)
        ? existingRawVersions
        : existingRawVersions?.toArray?.() || [];
      this.args.submission.aiFinalEditVersions =
        existingVersions.concat(appendedVersion);

      this.alert.showToast(
        'success',
        'Final edit version saved',
        'bottom-end',
        2500,
        false,
        null
      );
    } catch (error) {
      this.alert.showToast(
        'error',
        error.message || 'Failed to save final edit version',
        'bottom-end',
        5000,
        false,
        null
      );
    } finally {
      this.isSavingFinalEdit = false;
    }
  }

  @action
  cancelCompose() {
    this.editRevisionText = '';
    this.editRevisionNote = '';
    this.isEditing = false;
    this.isRevising = false;
    this.isFinishingDraft = false;
    this.editingReplyId = null;
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

  // TEMPORARY A/B TEST CODE - REMOVE AFTER TESTING PERIOD
  @action
  handleVariantDraftSelected(draftSelection) {
    // TEMPORARY A/B TEST CODE: Set the selected draft for the in-place editor
    const draftText =
      typeof draftSelection === 'string'
        ? draftSelection
        : draftSelection?.draftText;
    if (!draftText) {
      return;
    }

    if (typeof draftSelection === 'object' && draftSelection !== null) {
      this.latestBroughtDownVariantLogId = draftSelection.variantLogId || null;
      this.latestBroughtDownRequestId = draftSelection.requestId || null;
      this.latestBroughtDownVariantKey = draftSelection.variantKey || null;
    }

    const preparedDraft = this._prepareDraftForEditor(draftText);
    this.aiGeneratedText = preparedDraft;
    const existingContent = this.quillText || this.variantComposeText;
    const mergedText = this._mergeDraftIntoEditor(
      existingContent,
      preparedDraft,
      draftSelection?.variantKey
    );
    this.variantComposeText = mergedText;
    this.quillText = mergedText;
  }
  // END TEMPORARY A/B TEST CODE
}
