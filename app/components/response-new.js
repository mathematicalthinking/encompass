//TODO: find out how Use Only Own Markup is expected to work

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default class ResponseNewComponent extends Component {
  @service currentUser;
  @service('utility-methods') utils;
  @service('loading-display') loading;
  @service errorHandling;
  @service('sweet-alert') alert;
  @service store;
  @service router;
  @service('ai-draft') aiDraft;

  @tracked isEditing = false;
  @tracked isCreating = false;
  @tracked anonymous = false;
  @tracked showExisting = false;
  @tracked subResponses = [];
  @tracked selections = [];
  @tracked comments = [];
  @tracked submission = null;
  @tracked showSelections = false;
  @tracked showComments = false;
  @tracked quillText = '';
  @tracked isQuillEmpty = false;
  @tracked isQuillTooLong = false;

  // AI Draft and Logging related tracked properties
  @tracked originalText = '';
  @tracked aiGeneratedText = null;
  @tracked hasUsedAIDraft = false;
  @tracked doShowLoadingMessage = false;
  @tracked quillEditorKey = 0;
  @tracked pendingContent = null;
  @tracked aiDraftRating = null;
  @tracked showUsageCheckboxes = false;
  @tracked usageNotForStudents = false;
  @tracked usageNotForSelf = false;
  @tracked usageForStudents = false;
  @tracked usageToThinkAbout = false;
  @tracked usageFeedbackOnAI = false;

  starDefinitions = [
    { value: 1, tooltip: 'Not usable - requires complete rewrite' },
    {
      value: 2,
      tooltip: 'Has significant errors or disconnects that prevent use',
    },
    { value: 3, tooltip: 'Usable but requires editing before sending' },
    { value: 4, tooltip: 'Ready to use - could be sent as is' },
    { value: 5, tooltip: 'Exceptional quality - exceeds expectations' },
  ];

  usageOptions = [
    {
      key: 'usageNotForStudents',
      label: 'I would/will not use this with students',
    },
    {
      key: 'usageNotForSelf',
      label:
        'I will not use this for myself (learning about math, feedback, or my students)',
    },
    {
      key: 'usageForStudents',
      label: 'I would/will use this with my students',
    },
    {
      key: 'usageToThinkAbout',
      label: 'I will save this as something to think about',
    },
    {
      key: 'usageFeedbackOnAI',
      label: 'I will use this to give feedback on the AI performance',
    },
  ];

  doUseOnlyOwnMarkup = true;
  maxResponseLength = 14680064;

  errorPropsToRemove = ['recordSaveErrors'];

  get initializedText() {
    if (this.args.isCreating && !this.isEditing) {
      return this.preFormatText();
    }
    return this.originalText || this.preFormatText();
  }

  get todaysDate() {
    return new Date();
  }

  get commentFilter() {
    return [
      { label: 'Notice', value: 'notice', isChecked: true },
      { label: 'Wonder', value: 'wonder', isChecked: true },
      { label: 'Feedback', value: 'feedback', isChecked: true },
    ];
  }

  // Converted all computed properties to getters
  get notEditing() {
    return !this.isEditing;
  }

  get notPersisted() {
    return !this.args.responseData?.persisted;
  }

  get notDirty() {
    return !this.dirty;
  }

  get cantRespond() {
    return !this.canRespond;
  }

  get confirmLeaving() {
    return this.isEditing && this.dirty;
  }

  get replyNote() {
    return this.args.replyNote;
  }

  get filteredSelections() {
    if (!this.args.responseData?.selections) return [];

    if (this.doUseOnlyOwnMarkup) {
      return this.args.responseData.selections.filter((selection) => {
        if (selection.isTrashed) {
          return false;
        }
        let creatorId = this.utils.getBelongsToId(selection, 'createdBy');
        return creatorId === this.currentUser.id;
      });
    }
    return this.args.responseData.selections.filter(
      (selection) => !selection.isTrashed
    );
  }

  get hasSubmission() {
    return Boolean(this.args.submission);
  }

  get filteredComments() {
    if (!this.args.responseData?.comments) return [];

    const chosenFilter = this.commentFilter
      .filter((item) => item.isChecked)
      .map((item) => item.value);

    if (this.doUseOnlyOwnMarkup) {
      return this.args.responseData.comments.filter((comment) => {
        if (comment.isTrashed) {
          return false;
        }
        let creatorId = this.utils.getBelongsToId(comment, 'createdBy');
        return (
          creatorId === this.currentUser.id &&
          chosenFilter.includes(comment.label)
        );
      });
    }

    return this.args.responseData.comments.filter(
      (comment) => !comment.isTrashed && chosenFilter.includes(comment.label)
    );
  }

  get submitButtonText() {
    if (this.args.canDirectSend) {
      return 'Send';
    }
    return 'Submit for Approval';
  }

  get headingText() {
    if (this.isEditing) {
      return 'Editing Response';
    }
    if (this.isCreating) {
      return 'Creating New Response';
    }
    if (this.args.isRevising) {
      return 'New Revised Response';
    }
    return '';
  }

  get showNoteField() {
    return (
      this.args.newReplyType === 'mentor' &&
      this.args.newReplyStatus !== 'approved'
    );
  }

  get showEdit() {
    return !this.isEditing && this.args.newReplyStatus !== 'approved';
  }

  get canRevise() {
    return (
      this.args.creator?.id === this.currentUser.id &&
      this.args.responseData?.persisted
    );
  }

  get showRevise() {
    return this.canRevise && !this.args.isRevising;
  }

  get existingResponses() {
    if (!this.args.submissionResponses || !this.args.responseData?.id)
      return [];
    return this.args.submissionResponses.filter(
      (response) => response.id !== this.args.responseData.id
    );
  }

  get dirty() {
    if (this.args.data?.text) {
      return this.args.text !== this.args.data.text;
    }
    return this.args.responseData?.text !== this.quillText;
  }

  get canRespond() {
    return !this.args.isStatic;
  }

  get explainEmptiness() {
    return (
      this.filteredSelections.length === 0 &&
      !this.isEditing &&
      !this.args.isRevising &&
      !this.args.responseData?.text
    );
  }

  get isToStudent() {
    return this.args.to === this.args.student;
  }

  get who() {
    if (this.anonymous) {
      return 'Someone';
    }
    if (this.isToStudent) {
      return 'You';
    }
    return this.args.responseData?.student;
  }

  get greeting() {
    if (!this.args.responseData?.student) return 'Hello,';
    let brk = this.args.responseData.student.indexOf(' ');
    let firstname =
      brk === -1
        ? this.args.responseData.student
        : this.args.responseData.student.slice(0, brk);
    return `Hello ${firstname},`;
  }

  get replyText() {
    // If we have pending content, use it for initial render
    if (this.pendingContent !== null) {
      return this.pendingContent;
    }
    return this.preFormatText();
  }

  get shortText() {
    if (typeof this.args.responseData?.text !== 'string') {
      return '';
    }
    return this.args.responseData.text.slice(0, 150);
  }

  get moreDetailsLinkText() {
    if (this.args.showDetails) {
      return 'Hide Details';
    }
    return 'More Details';
  }

  get aiButtonTooltip() {
    if (!this.hasSubmission)
      return 'AI draft generation requires a valid submission';
    if (!this.aiDraft.hasStudentWork(this.actualSubmission))
      return 'AI draft generation requires student work (answers or explanations)';
    return 'Generate AI draft based on student work';
  }

  get aiButtonDisabled() {
    const hasSubmission = this.hasSubmission;
    const actualSubmission = this.actualSubmission;
    const hasWork = actualSubmission
      ? this.aiDraft.hasStudentWork(actualSubmission)
      : false;

    return !hasSubmission || !hasWork;
  }

  get isValidQuillContent() {
    return !this.isQuillEmpty && !this.isQuillTooLong;
  }

  get showAiDraftSection() {
    return this.aiGeneratedText !== null;
  }

  get canBringDown() {
    return !this.hasUsedAIDraft && this.aiDraftRating !== null;
  }

  get showRatingControls() {
    return !this.hasUsedAIDraft && !this.showUsageCheckboxes;
  }

  get hasSelectedUsageOption() {
    return (
      this.usageNotForStudents ||
      this.usageNotForSelf ||
      this.usageForStudents ||
      this.usageToThinkAbout ||
      this.usageFeedbackOnAI
    );
  }

  @action
  isStarFilled(starNumber) {
    return this.aiDraftRating !== null && this.aiDraftRating >= starNumber;
  }

  quote(string, opts, isImageTag) {
    string = string.replace(/(\r\n|\n|\r)/gm, ' ');
    let defaultPrefix = '         ';
    let prefix = defaultPrefix;
    let str = '';

    let doWrapStringInBlockQuote = true;

    if (opts && Object.prototype.hasOwnProperty.call(opts, 'type')) {
      doWrapStringInBlockQuote = false;
      if (opts.usePrefix) {
        switch (opts.type) {
          case 'notice':
            prefix = '...and I noticed that...';
            break;
          case 'wonder':
            prefix = '...and I wondered about...';
            break;
          case 'feedback':
            prefix = '...and I thought...';
            break;
          default:
            prefix = defaultPrefix;
            break;
        }
      }
    }
    if (doWrapStringInBlockQuote) {
      if (isImageTag) {
        str += string;
      } else {
        str += `<blockquote class="pf-response-text">${string}</blockquote><br>`;
      }
    } else {
      str += `<p>${prefix}</p><br>`;
      if (isImageTag) {
        str += string;
      } else {
        str += `<p class="pf-response-text">${string}</p><br>`;
      }
    }
    return str;
  }

  get actualSubmission() {
    return this.args.submission;
  }

  clearErrorProps() {
    this.args.removeMessages?.(this.errorPropsToRemove);
  }

  _getSubmissionId() {
    return (
      this.args.responseData?._submissionRef?.id ??
      this.args.submission?.id ??
      null
    );
  }

  preFormatText() {
    let greeting = this.greeting;
    let text = `<p>${greeting}</p><br>`;

    if (this.filteredSelections.length > 0) {
      this.filteredSelections.forEach((s) => {
        let who = this.who;
        let quoteInput;
        let selText = s.text;
        let imageTagLink = s.imageTagLink;
        let isImageTag = false;

        if (imageTagLink) {
          isImageTag = true;
          quoteInput = `<img src="${imageTagLink}" alt="${selText}"><br>`;
        } else {
          quoteInput = selText;
        }

        let quoteText = this.quote(quoteInput, null, isImageTag);
        text += `<p>${who} wrote:</p><br>`;
        text += quoteText;

        this.filteredComments.forEach((comment) => {
          let selId = this.utils.getBelongsToId(comment, 'selection');
          if (selId === s.id) {
            let opts = {
              type: comment.label,
              usePrefix: true,
            };
            text += this.quote(comment.text, opts);
          }
        });
      });
    }
    return text;
  }

  async createRevision() {
    let record = this.store.createRecord('response', {
      recipient: this.args.recipient,
      createdBy: this.currentUser.user,
      submission: this.args.submission?.content,
      workspace: this.args.workspace,
      selections: this.args.responseData?.selections?.content,
      comments: this.args.responseData?.comments?.content,
      status: this.args.newReplyStatus,
      responseType: this.args.newReplyType,
      source: 'submission',
    });

    if (this.args.responseData) {
      this.args.responseData.status = 'superceded';
    }

    const [revision, original] = await Promise.all([
      record.save(),
      this.args.responseData?.save(),
    ]);

    this.args.isRevising = false;
    this.alert.showToast(
      'success',
      'Revision Created',
      'bottom-end',
      3000,
      false,
      null
    );

    return { revision, original };
  }

  // Actions converted to @action methods
  @action
  toggleProperty(p) {
    this[p] = !this[p];
  }

  cleanupTrashedItems(response) {
    response.selections?.forEach((selection) => {
      if (selection.isTrashed) {
        response.selections.removeObject(selection);
      }
    });

    response.comments?.forEach((comment) => {
      if (comment.isTrashed) {
        response.comments.removeObject(comment);
      }
    });
  }

  prepareResponseData(response, isDraft) {
    const status = isDraft ? 'draft' : this.args.newReplyStatus;

    response.set('original', this.originalText);
    response.set('status', status);
    response.set('text', this.quillText);
    response.set('note', this.args.replyNote);

    // Set submission relationship from passed argument
    // Check if submission content exists, not just the property
    if (this.args.submission) {
      console.log(
        'Setting submission relationship to:',
        this.args.submission.id
      );
      response.set('submission', this.args.submission);
    }

    if (!response.get('createdBy.content')) {
      response.set('createdBy', this.currentUser.user);
    }
    if (!response.get('responseType')) {
      response.set('responseType', this.args.newReplyType);
    }
  }

  handleSaveSuccess(savedResponse, toastMessage, isDraft) {
    console.log(
      'handleSaveSuccess called - savedResponse:',
      savedResponse.id,
      'isDraft:',
      isDraft
    );
    console.log('Saved response submission:', savedResponse.submission?.id);
    console.log('Saved response status:', savedResponse.status);

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

    if (isDraft) {
      // For drafts, refresh the current route to show the new draft
      this.args.handleResponseThread?.(savedResponse, 'mentor');

      // Refresh the route to reload responses including the new draft
      this.router.transitionTo(
        'responses.submission',
        this.args.submission.id,
        {
          queryParams: { responseId: savedResponse.id },
        }
      );

      console.log('Draft saved successfully, refreshing route');
    } else {
      this.args.handleResponseThread?.(savedResponse, 'mentor');
      this.args.onSaveSuccess?.(this.args.submission, savedResponse);
    }
  }

  handleSaveError(err, response) {
    this.loading.handleLoadingMessage(
      this,
      'end',
      'isReplySending',
      'doShowLoadingMessage'
    );
    this.errorHandling.handleErrors(err, 'recordSaveErrors', response);
  }

  convertPlainTextToHtml(text) {
    if (!text) return '';

    let normalized = text;

    // 1. Normalize line endings
    normalized = normalized.replace(/\r\n/g, '\n');

    normalized = normalized.replace(/^ {2}(?=\d|-|\*)/gm, '    ');

    normalized = normalized.replace(
      /^(\s*\d+\..+)\n(?!\s*\d|\s*\\-|\s*$)(.*)/gm,
      '$1 $2'
    );

    normalized = normalized.replace(/(\n\n)(?=\s*\d+\.)/g, '\n');

    // 2. Configure Marked
    const rawHtml = marked.parse(normalized, {
      breaks: true,
      gfm: true,
    });

    // 3. Sanitize
    return DOMPurify.sanitize(rawHtml);
  }

  @action
  saveDraftResponse() {
    this.saveResponse(true);
  }

  @action
  saveResponse(isDraft = false) {
    console.log(
      'ResponseNew saveResponse - isDraft:',
      isDraft,
      'newReplyStatus:',
      this.args.newReplyStatus
    );
    if (!this.isValidQuillContent) return;

    const response = this.args.responseData;
    const toastMessage = isDraft ? 'Draft Saved' : 'Response Sent';

    this.cleanupTrashedItems(response);
    this.prepareResponseData(response, isDraft);

    if (this.args.workspace) {
      this.args.workspace.rollbackAttributes();
    }
    if (this.args.submission) {
      this.args.submission.rollbackAttributes();
    }

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );

    response
      .save()
      .then((savedResponse) =>
        this.handleSaveSuccess(savedResponse, toastMessage, isDraft)
      )
      .catch((err) => this.handleSaveError(err, response));
  }

  @action
  updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
  }

  @action
  async generateAIDraft() {
    if (
      !this.hasSubmission ||
      !this.aiDraft.hasStudentWork(this.actualSubmission)
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

    const submissionId = this._getSubmissionId();
    if (!submissionId) {
      this.alert.showToast(
        'error',
        'Cannot generate AI draft: Submission ID not found',
        'bottom-end',
        5000,
        false,
        null
      );
      return;
    }

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isAIDraftLoading',
      'doShowLoadingMessage'
    );
    try {
      const draft = await this.aiDraft.generateDraft(submissionId);

      // Clear any pending content from previous "Bring it Down"
      this.pendingContent = null;

      // Convert AI plain text to HTML immediately and store it
      this.aiGeneratedText = this.convertPlainTextToHtml(draft);
      this.hasUsedAIDraft = false; // Reset "Bring it Down" button
      this.aiDraftRating = null; // Reset rating for new draft

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
      this.loading.handleLoadingMessage(
        this,
        'end',
        'isAIDraftLoading',
        'doShowLoadingMessage'
      );
    }
  }

  @action
  bringAiDraftDown() {
    if (!this.canBringDown || !this.aiGeneratedText) {
      return;
    }
    // Show usage checkboxes instead of immediately copying
    this.showUsageCheckboxes = true;
  }

  @action
  continueWithAIDraft() {
    if (!this.hasSelectedUsageOption) {
      this.alert.showToast(
        'info',
        'Please select at least one option before continuing',
        'bottom-end',
        3000,
        false,
        null
      );
      return;
    }

    // Get current editor content (HTML format)
    const currentText = this.quillText || '';
    const separator = currentText.trim() ? '<p><br></p>' : '';

    // Combine HTML
    const newText = currentText + separator + this.aiGeneratedText;

    // Set pending content and force Quill re-render
    this.pendingContent = newText;
    this.quillEditorKey += 1;

    // Update tracked properties
    this.quillText = newText;
    let isEmpty = newText.trim() === '' || newText === '<p><br></p>';
    let isOverLimit = newText.length > this.maxResponseLength;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLimit;

    // Mark draft as used
    this.hasUsedAIDraft = true;
    this.showUsageCheckboxes = false;

    this.alert.showToast(
      'success',
      'AI draft copied to editor',
      'bottom-end',
      2000,
      false,
      null
    );
  }

  @action
  setStarRating(rating) {
    this.aiDraftRating = rating;
  }
}
