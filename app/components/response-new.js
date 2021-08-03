import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  tagName: '',
  elementId: 'response-new',

  utils: service('utility-methods'),
  loading: service('loading-display'),

  isEditing: false,
  isCreating: false,
  anonymous: false,
  showExisting: false,
  subResponses: () => [],
  selections: () => [],
  comments: () => [],
  submission: null,
  showSelections: false,
  showComments: false,
  notEditing: not('isEditing'),
  notPersisted: not('persisted'),
  notDirty: not('dirty'),
  cantRespond: not('canRespond'),
  confirmLeaving: and('isEditing', 'dirty'),
  alert: service('sweet-alert'),
  todaysDate: () => new Date(),
  doUseOnlyOwnMarkup: true,

  quillEditorId: 'response-new-editor',
  quillText: '',
  maxResponseLength: 14680064,
  errorPropsToRemove: () => [
    'recordSaveErrors',
    'emptyReplyError',
    'quillTooLongError',
  ],

  didReceiveAttrs() {
    if (this.isCreating && !this.isEditing) {
      // preformat text and set on model;
      this.preFormatText();
    }

    this._super(...arguments);
  },

  filteredSelections: computed(
    'currentUser.id',
    'doUseOnlyOwnMarkup',
    'model.selections.@each.isTrashed',
    function () {
      // filter out trashed selections
      // if a user deletes a selection and then immediately after
      // goes to make a response, the trashed selection may still
      // be associated with the workspace

      if (this.doUseOnlyOwnMarkup) {
        return this.model.selections.filter((selection) => {
          if (selection.get('isTrashed')) {
            return false;
          }
          let creatorId = this.utils.getBelongsToId(selection, 'createdBy');
          return creatorId === this.currentUser.id;
        });
      }
      return this.model.selections.rejectBy('isTrashed');
    }
  ),

  filteredComments: computed(
    'currentUser.id',
    'doUseOnlyOwnMarkup',
    'model.comments.@each.isTrashed',
    function () {
      // filter out trashed selections
      // if a user deletes a selection and then immediately after
      // goes to make a response, the trashed selection may still
      // be associated with the workspace

      if (this.doUseOnlyOwnMarkup) {
        return this.model.comments.filter((comment) => {
          if (comment.get('isTrashed')) {
            return false;
          }

          let creatorId = this.utils.getBelongsToId(comment, 'createdBy');
          return creatorId === this.currentUser.id;
        });
      }
      return this.model.comments.rejectBy('isTrashed');
    }
  ),

  willDestroyElement() {
    if (!this.model.persisted) {
      this.model.unloadRecord();
    }
    this._super(...arguments);
  },

  submitButtonText: computed('canDirectSend', function () {
    if (this.canDirectSend) {
      return 'Send';
    }
    return 'Submit for Approval';
  }),

  headingText: computed('isEditing', 'isCreating', 'isRevising', function () {
    if (this.isEditing) {
      return 'Editing Response';
    }
    if (this.isCreating) {
      return 'Creating New Response';
    }
    if (this.isRevising) {
      ('New Revised Response');
    }
    return;
  }),

  showNoteField: computed('newReplyStatus', 'newReplyType', function () {
    return this.newReplyType === 'mentor' && this.newReplyStatus !== 'approved';
  }),

  showEdit: computed('newReplyStatus', 'isEditing', function () {
    return !this.isEditing && this.newReplyStatus !== 'approved';
  }),

  canRevise: computed(
    'creator.id',
    'currentUser.id',
    'model.persisted',
    function () {
      return this.creator.id === this.currentUser.id && this.model.persisted;
    }
  ),
  showRevise: computed('canRevise', 'isRevising', function () {
    return this.canRevise && !this.isRevising;
  }),

  existingResponses: computed(
    'model.id',
    'submissionResponses.[]',
    function () {
      let modelId = this.model.id;
      return this.submissionResponses.rejectBy('id', modelId);
    }
  ),

  dirty: computed('data.text', 'model.text', 'response', 'text', function () {
    if (this.data.text) {
      return this.text !== this.data.text;
    }
    return this.model.text !== this.response;
  }),

  canRespond: computed.not('isStatic'),

  explainEmptiness: computed(
    'isEditing',
    'filteredSelections.[]',
    'model.text',
    'isRevising',
    function () {
      return (
        this.filteredSelections.length === 0 &&
        !this.isEditing &&
        !this.isRevising &&
        !this.model.text
      );
    }
  ),

  isToStudent: computed('student', 'to', function () {
    return this.to === this.student;
  }),

  who: computed(
    'anonymous',
    'isToStudent',
    'model.student',
    'student',
    'to',
    function () {
      if (this.anonymous) {
        return 'Someone';
      }
      if (this.isToStudent) {
        return 'You';
      }

      return this.model.student;
    }
  ),

  greeting: computed('model.student', function () {
    let brk = this.model.student.indexOf('');
    let firstname =
      brk === -1 ? this.model.student : this.model.student.substr(0, brk);
    return `Hello ${firstname},`;
  }),

  quote: function (string, opts, isImageTag) {
    string = string.replace(/(\r\n|\n|\r)/gm, ' '); //normalize the string: remove new lines
    let defaultPrefix = '         ';
    let prefix = defaultPrefix;
    let str = '';

    let doWrapStringInBlockQuote = true;

    if (opts && opts.hasOwnProperty('type')) {
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
  },

  preFormatText: function () {
    let greeting = this.greeting;
    let text = `<p>${greeting}</p><br>`;

    if (this.filteredSelections.length > 0) {
      this.filteredSelections.forEach((s) => {
        let who = this.who;

        let quoteInput;

        let selText = s.get('text');
        let imageTagLink = s.get('imageTagLink');
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
          if (selId === s.get('id')) {
            let opts = {
              type: comment.get('label'),
              usePrefix: true,
            };

            text += this.quote(comment.get('text'), opts);
          }
        });
      });

      this.set('replyText', text);
      this.set('originalText', text);
    }
  },

  shortText: computed('model.text', function () {
    if (typeof this.model.text !== 'string') {
      return '';
    }
    return this.model.text.slice(0, 150);
  }),

  createRevision() {
    let record = this.store.createRecord('response', {
      recipient: this.recipient,
      createdBy: this.currentUser,
      submission: this.submission.content,
      workspace: this.workspace,
      selections: this.model.selections.content,
      comments: this.model.comments.content,
      status: this.newReplyStatus,
      responseType: this.newReplyType,
      source: 'submission',
    });

    this.set('model.status', 'superceded');
    return hash({
      revision: record.save(),
      original: this.model.save(),
    }).then((hash) => {
      this.set('isRevising', false);
      // handle success
      this.alert.showToast(
        'success',
        'Revision Created',
        'bottom-end',
        3000,
        false,
        null
      );
    });
  },
  moreDetailsLinkText: computed('showDetails', function () {
    if (this.showDetails) {
      return 'Hide Details';
    }
    return 'More Details';
  }),

  getQuillErrors() {
    let errors = [];
    if (this.isQuillEmpty) {
      errors.addObject('emptyReplyError');
    }
    if (this.isQuillTooLong) {
      errors.addObject('quillTooLongError');
    }
    return errors;
  },

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  },

  quillTooLongErrorMsg: computed(
    'quillText.length',
    'maxResponseLength',
    function () {
      let len = this.quillText.length;
      let maxLength = this.maxResponseLength;
      let maxSizeDisplay = this.returnSizeDisplay(maxLength);
      let actualSizeDisplay = this.returnSizeDisplay(len);

      return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
    }
  ),

  clearErrorProps() {
    this.removeMessages(this.errorPropsToRemove);
  },

  actions: {
    toggleProperty: function (p) {
      this.toggleProperty(p);
    },
    saveResponse(isDraft) {
      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach((errorProp) => {
          this.set(errorProp, true);
        });
        return;
      }

      let response = this.model;

      // need to remove any trashed selections or comments

      response.get('selections').forEach((selection) => {
        if (selection.get('isTrashed')) {
          response.get('selections').removeObject(selection);
        }
      });

      response.get('comments').forEach((comment) => {
        if (comment.get('isTrashed')) {
          response.get('comments').removeObject(comment);
        }
      });

      let toastMessage = isDraft ? 'Draft Saved' : 'Response Sent';
      let newStatus = isDraft ? 'draft' : this.newReplyStatus;

      response.setProperties({
        original: this.originalText,
        createdBy: this.currentUser,
        status: newStatus,
        responseType: this.newReplyType,
        text: this.quillText,
        note: this.replyNote,
      });

      this.loading.handleLoadingMessage(
        this,
        'start',
        'isReplySending',
        'doShowLoadingMessage'
      );

      response
        .save()
        .then((savedResponse) => {
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
          this.handleResponseThread(savedResponse, 'mentor');
          this.onSaveSuccess(this.submission, savedResponse);
        })
        .catch((err) => {
          this.loading.handleLoadingMessage(
            this,
            'end',
            'isReplySending',
            'doShowLoadingMessage'
          );

          this.handleErrors(err, 'recordSaveErrors', response);
        });
    },

    toggleOwnMarkUpOnly(e) {
      this.send('toggleProperty', 'doUseOnlyOwnMarkup');
      this.set('replyText', '');
      this.preFormatText();
    },

    updateQuillText(content, isEmpty, isOverLengthLimit) {
      this.set('quillText', content);
      this.set('isQuillEmpty', isEmpty);
      this.set('isQuillTooLong', isOverLengthLimit);
    },
  },
});
