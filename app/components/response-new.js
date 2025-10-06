//TODO: find out how Use Only Own Markup is expected to work

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
export default class ResponseNewComponent extends Component {
  @service('current-user') currentUser;
  @service('utility-methods') utils;
  @service('loading-display') loading;
  @service('error-handling') errorHandling;
  @service('sweet-alert') alert;
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

  doUseOnlyOwnMarkup = true;
  quillEditorId = 'response-new-editor';
  maxResponseLength = 14680064;

  errorPropsToRemove = [
    'recordSaveErrors',
    'emptyReplyError',
    'quillTooLongError',
  ];

  get initializedText() {
    if (this.args.isCreating && !this.isEditing && !this.originalText) {
      return this.preFormatText();
    }
    return this.originalText;
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
    return !this.args.model?.persisted;
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
    if (!this.args.model?.selections) return [];

    if (this.doUseOnlyOwnMarkup) {
      return this.args.model.selections.filter((selection) => {
        if (selection.isTrashed) {
          return false;
        }
        let creatorId = this.utils.getBelongsToId(selection, 'createdBy');
        return creatorId === this.currentUser.user.id;
      });
    }
    return this.args.model.selections.filter(
      (selection) => !selection.isTrashed
    );
  }

  get filteredComments() {
    if (!this.args.model?.comments) return [];

    const chosenFilter = this.commentFilter
      .filter((item) => item.isChecked)
      .map((item) => item.value);

    if (this.doUseOnlyOwnMarkup) {
      return this.args.model.comments.filter((comment) => {
        if (comment.isTrashed) {
          return false;
        }
        let creatorId = this.utils.getBelongsToId(comment, 'createdBy');
        return (
          creatorId === this.currentUser.user.id &&
          chosenFilter.includes(comment.label)
        );
      });
    }

    return this.args.model.comments.filter(
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
      this.args.creator?.id === this.currentUser.user.id &&
      this.args.model?.persisted
    );
  }

  get showRevise() {
    return this.canRevise && !this.args.isRevising;
  }

  get existingResponses() {
    if (!this.args.submissionResponses || !this.args.model?.id) return [];
    return this.args.submissionResponses.filter(
      (response) => response.id !== this.args.model.id
    );
  }

  get dirty() {
    if (this.args.data?.text) {
      return this.args.text !== this.args.data.text;
    }
    return this.args.model?.text !== this.quillText;
  }

  get canRespond() {
    return !this.args.isStatic;
  }

  get explainEmptiness() {
    return (
      this.filteredSelections.length === 0 &&
      !this.isEditing &&
      !this.args.isRevising &&
      !this.args.model?.text
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
    return this.args.model?.student;
  }

  get greeting() {
    if (!this.args.model?.student) return 'Hello,';
    let brk = this.args.model.student.indexOf(' ');
    let firstname =
      brk === -1
        ? this.args.model.student
        : this.args.model.student.slice(0, brk);
    return `Hello ${firstname},`;
  }

  get replyText() {
    return this.preFormatText();
  }

  get shortText() {
    if (typeof this.args.model?.text !== 'string') {
      return '';
    }
    return this.args.model.text.slice(0, 150);
  }

  get moreDetailsLinkText() {
    if (this.args.showDetails) {
      return 'Hide Details';
    }
    return 'More Details';
  }

  get quillTooLongErrorMsg() {
    let len = this.quillText.length;
    let maxLength = this.maxResponseLength;
    let maxSizeDisplay = this.returnSizeDisplay(maxLength);
    let actualSizeDisplay = this.returnSizeDisplay(len);

    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
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

  getQuillErrors() {
    let errors = [];
    if (this.isQuillEmpty) {
      errors.push('emptyReplyError');
    }
    if (this.isQuillTooLong) {
      errors.push('quillTooLongError');
    }
    return errors;
  }

  clearErrorProps() {
    this.args.removeMessages?.(this.errorPropsToRemove);
  }

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
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

      // Only set originalText if it's not already set (avoid reactivity issues)
      if (!this.originalText) {
        this.originalText = text;
      }
      return text;
    }
    // Return text even if no selections
    return text;
  }

  createRevision() {
    let record = this.store.createRecord('response', {
      recipient: this.args.recipient,
      createdBy: this.currentUser.user,
      submission: this.args.submission?.content,
      workspace: this.args.workspace,
      selections: this.args.model?.selections?.content,
      comments: this.args.model?.comments?.content,
      status: this.args.newReplyStatus,
      responseType: this.args.newReplyType,
      source: 'submission',
    });

    this.args.model.status = 'superceded';
    return hash({
      revision: record.save(),
      original: this.args.model.save(),
    }).then((hash) => {
      this.args.isRevising = false;
      this.alert.showToast(
        'success',
        'Revision Created',
        'bottom-end',
        3000,
        false,
        null
      );
    });
  }

  // Actions converted to @action methods
  @action
  toggleProperty(p) {
    this[p] = !this[p];
  }

  validateQuillContent() {
    const errors = this.getQuillErrors();
    if (errors.length > 0) {
      errors.forEach((errorProp) => {
        this[errorProp] = true;
      });
      return false;
    }
    return true;
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
  saveResponse(isDraft) {
    if (!this.validateQuillContent()) return;

    const response = this.args.model;
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
