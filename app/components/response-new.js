//TODO: find out how Use Only Own Markup is expected to work

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class ResponseNewComponent extends Component {
  @service currentUser;
  @service utils;
  @service('loading-display') loading; // for this line either use this way or we would have to change the service name
  @service errorHandling;
  @service alert;
  @service store;

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
  @tracked originalText = '';

  @tracked doShowLoadingMessage = false;

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

  get isValidQuillContent() {
    return !this.isQuillEmpty && !this.isQuillTooLong;
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

  clearErrorProps() {
    this.args.removeMessages?.(this.errorPropsToRemove);
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

    response.setProperties({
      original: this.originalText,
      createdBy: this.currentUser.user,
      status,
      responseType: this.args.newReplyType,
      text: this.quillText,
      note: this.args.replyNote,
    });
  }

  handleSaveSuccess(savedResponse, toastMessage) {
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
    this.args.handleResponseThread?.(savedResponse, 'mentor');
    this.args.onSaveSuccess?.(this.args.submission, savedResponse);
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

  @action
  saveDraftResponse() {
    this.saveResponse(true);
  }

  @action
  saveResponse(isDraft) {
    if (!this.isValidQuillContent) return;

    const response = this.args.responseData;
    const toastMessage = isDraft ? 'Draft Saved' : 'Response Sent';

    this.cleanupTrashedItems(response);
    this.prepareResponseData(response, isDraft);

    this.loading.handleLoadingMessage(
      this,
      'start',
      'isReplySending',
      'doShowLoadingMessage'
    );

    response
      .save()
      .then((savedResponse) =>
        this.handleSaveSuccess(savedResponse, toastMessage)
      )
      .catch((err) => this.handleSaveError(err, response));
  }

  @action
  updateQuillText(content, isEmpty, isOverLengthLimit) {
    this.quillText = content;
    this.isQuillEmpty = isEmpty;
    this.isQuillTooLong = isOverLengthLimit;
  }
}
