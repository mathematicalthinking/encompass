import Component from '@ember/component';
import { computed } from '@ember/object';
import { and, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  currentUser: service('current-user'),
  elementId: 'response-new',

  utils: service('utility-methods'),
  loading: service('loading-display'),

  isEditing: false,
  isCreating: false,
  anonymous: false,
  showExisting: false,
  subResponses: [],
  selections: [],
  comments: [],
  submission: null,
  showSelections: false,
  showComments: false,
  notEditing: not('isEditing'),
  notPersisted: not('persisted'),
  notDirty: not('dirty'),
  cantRespond: not('canRespond'),
  confirmLeaving: and('isEditing', 'dirty'),
  alert: service('sweet-alert'),
  todaysDate: new Date(),
  doUseOnlyOwnMarkup: true,

  quillEditorId: 'response-new-editor',
  quillText: '',
  maxResponseLength: 14680064,
  errorPropsToRemove: [
    'recordSaveErrors',
    'emptyReplyError',
    'quillTooLongError',
  ],
  commentFilter: [
    { label: 'Notice', value: 'notice', isChecked: true },
    { label: 'Wonder', value: 'wonder', isChecked: true },
    { label: 'Feedback', value: 'feedback', isChecked: true },
  ],

  didReceiveAttrs() {
    if (this.isCreating && !this.isEditing) {
      // preformat text and set on model;
      this.preFormatText();
    }

    this._super(...arguments);
  },

  filteredSelections: computed(
    'model.selections.@each.isTrashed',
    'doUseOnlyOwnMarkup',
    function () {
      // filter out trashed selections
      // if a user deletes a selection and then immediately after
      // goes to make a response, the trashed selection may still
      // be associated with the workspace

      if (this.doUseOnlyOwnMarkup) {
        return this.get('model.selections').filter((selection) => {
          if (selection.get('isTrashed')) {
            return false;
          }
          let creatorId = this.utils.getBelongsToId(selection, 'createdBy');
          return creatorId === this.get('currentUser.user.id');
        });
      }
      return this.get('model.selections').rejectBy('isTrashed');
    }
  ),

  filteredComments: computed(
    'model.comments.@each.isTrashed',
    'commentFilter.@each.isChecked',
    'doUseOnlyOwnMarkup',
    function () {
      // filter out trashed selections
      // if a user deletes a selection and then immediately after
      // goes to make a response, the trashed selection may still
      // be associated with the workspace

      if (this.doUseOnlyOwnMarkup) {
        return this.get('model.comments').filter((comment) => {
          if (comment.get('isTrashed')) {
            return false;
          }
          const chosenFilter = this.commentFilter
            .filter((item) => item.isChecked)
            .map((item) => item.value);

          let creatorId = this.utils.getBelongsToId(comment, 'createdBy');
          return (
            creatorId === this.get('currentUser.user.id') &&
            chosenFilter.includes(comment.label)
          );
        });
      }
      const chosenFilter = this.commentFilter
        .filter((item) => item.isChecked)
        .map((item) => item.value);
      return (
        this.get('model.comments').rejectBy('isTrashed') &&
        chosenFilter.includes(comment.label)
      );
    }
  ),

  willDestroyElement() {
    if (!this.get('model.persisted')) {
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
  }),

  showNoteField: computed('newReplyStatus', 'newReplyType', function () {
    return this.newReplyType === 'mentor' && this.newReplyStatus !== 'approved';
  }),

  showEdit: computed('newReplyStatus', 'isEditing', function () {
    return !this.isEditing && this.newReplyStatus !== 'approved';
  }),

  canRevise: computed(
    'creator',
    'model.persisted',
    'currentUser.user',
    function () {
      return (
        this.get('creator.id') === this.get('currentUser.user.id') &&
        this.get('model.persisted')
      );
    }
  ),
  showRevise: computed('canRevise', 'isRevising', function () {
    return this.canRevise && !this.isRevising;
  }),

  existingResponses: computed('submissionResponses.[]', function () {
    let modelId = this.get('model.id');
    return this.submissionResponses.rejectBy('id', modelId);
  }),

  dirty: computed('model.text', 'data.text', 'response', function () {
    if (this.get('data.text')) {
      return this.text !== this.get('data.text');
    }
    return this.get('model.text') !== this.response;
  }),

  canRespond: computed('isStatic', function () {
    return !this.isStatic;
  }),

  explainEmptiness: computed(
    'isEditing',
    'filteredSelections.[]',
    'model.text',
    'isRevising',
    function () {
      return (
        this.get('filteredSelections.length') === 0 &&
        !this.isEditing &&
        !this.isRevising &&
        !this.get('model.text')
      );
    }
  ),

  isToStudent: computed('student', 'to', function () {
    return this.to === this.student;
  }),

  who: computed('student', 'to', 'anonymous', function () {
    if (this.anonymous) {
      return 'Someone';
    }
    if (this.isToStudent) {
      return 'You';
    }

    return this.get('model.student');
  }),

  greeting: computed('model.student', function () {
    let brk = this.get('model.student').indexOf(' ');
    let firstname =
      brk === -1
        ? this.get('model.student')
        : this.get('model.student').substr(0, brk);
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

    if (this.get('filteredSelections.length') > 0) {
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

      this.set('originalText', text);
      return text;
    }
  },

  replyText: computed('filteredComments', function () {
    return this.preFormatText();
  }),

  shortText: computed('model.text', function () {
    if (typeof this.get('model.text') !== 'string') {
      return '';
    }
    return this.get('model.text').slice(0, 150);
  }),

  createRevision() {
    let record = this.store.createRecord('response', {
      recipient: this.recipient,
      createdBy: this.currentUser.user,
      submission: this.get('submission.content'),
      workspace: this.workspace,
      selections: this.get('model.selections.content'),
      comments: this.get('model.comments.content'),
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
      let len = this.get('quillText.length');
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
        createdBy: this.currentUser.user,
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
