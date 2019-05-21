
Encompass.ResponseNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'response-new',

  utils: Ember.inject.service('utility-methods'),
  loading: Ember.inject.service('loading-display'),

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
  notEditing: Ember.computed.not('isEditing'),
  notPersisted: Ember.computed.not('persisted'),
  notDirty: Ember.computed.not('dirty'),
  cantRespond: Ember.computed.not('canRespond'),
  confirmLeaving: Ember.computed.and('isEditing', 'dirty'),
  alert: Ember.inject.service('sweet-alert'),
  todaysDate: new Date(),
  doUseOnlyOwnMarkup: true,

  quillEditorId: 'response-new-editor',
  quillText: '',
  maxResponseLength: 14680064,
  errorPropsToRemove: ['recordSaveErrors', 'emptyReplyError', 'quillTooLongError'],

  didReceiveAttrs() {
    if (this.get('isCreating') && !this.get('isEditing')) {
      // preformat text and set on model;
      this.preFormatText();
    }

    this._super(...arguments);
  },

  filteredSelections: function() {
    if (this.get('doUseOnlyOwnMarkup')) {
      return this.get('model.selections').filter((selection) => {
        let creatorId = this.get('utils').getBelongsToId(selection, 'createdBy');
        return creatorId === this.get('currentUser.id');
      });
    }
    return this.get('model.selections');
  }.property('model.selections.[]', 'doUseOnlyOwnMarkup'),

  filteredComments: function() {
    if (this.get('doUseOnlyOwnMarkup')) {
      return this.get('model.comments').filter((comment) => {
        let creatorId = this.get('utils').getBelongsToId(comment, 'createdBy');
        return creatorId === this.get('currentUser.id');
      });
    }
    return this.get('model.comments');
  }.property('model.comments.[]', 'doUseOnlyOwnMarkup'),

  willDestroyElement() {
    if (!this.get('model.persisted')) {
      this.get('model').unloadRecord();
    }
    this._super(...arguments);
  },

  submitButtonText: function() {
    if (this.get('canDirectSend')) {
      return 'Send';
    }
    return 'Submit for Approval';
  }.property('canDirectSend'),

  headingText: function() {
    if (this.get('isEditing')) {
      return 'Editing Response';
    }
    if (this.get('isCreating')) {
      return 'Creating New Response';
    }
    if (this.get('isRevising')) {
      'New Revised Response';
    }
  }.property('isEditing', 'isCreating', 'isRevising'),

  showNoteField: function() {
    return this.get('newReplyType') === 'mentor' && this.get('newReplyStatus') !== 'approved';
  }.property('newReplyStatus', 'newReplyType'),

  showEdit: function() {
    return !this.get('isEditing') && this.get('newReplyStatus') !== 'approved';
  }.property('newReplyStatus', 'isEditing'),

  canRevise: function() {
    return this.get('creator.id') === this.get('currentUser.id') && this.get('model.persisted');
  }.property('creator', 'model.persisted', 'currentUser'),
  showRevise: function() {
    return this.get('canRevise') && !this.get('isRevising');
  }.property('canRevise', 'isRevising'),


  existingResponses: function() {
    let modelId = this.get('model.id');
    return this.get('submissionResponses').rejectBy('id', modelId);
  }.property('submissionResponses.[]'),

  dirty: function () {
    if (this.get('data.text')) {
      return this.get('text') !== this.get('data.text');
    }
    return this.get('model.text') !== this.get('response');
  }.property('model.text', 'data.text', 'response'),

  canRespond: function () {
    return !this.get('isStatic');
  }.property('isStatic'),

  explainEmptiness: function () {
    return (this.get('filteredSelections.length') === 0 && !this.get('isEditing') && !this.get('isRevising') && !this.get('model.text'));
  }.property('isEditing', 'filteredSelections.[]', 'model.text', 'isRevising'),


  isToStudent: function () {
    return (this.get('to') === this.get('student'));
  }.property('student', 'to'),

  who: function () {
    if (this.get('anonymous')) {
      return 'Someone';
    }
    if (this.get('isToStudent')) {
      return 'You';
    }

    return this.get('model.student');
  }.property('student', 'to', 'anonymous'),

  greeting: function () {
    let brk = this.get('model.student').indexOf(' ');
    let firstname = (brk === -1) ? this.get('model.student') :
    this.get('model.student').substr(0, brk);
    return `Hello ${firstname},`;
  }.property('model.student'),

  quote: function (string, opts, isImageTag) {
    string = string.replace(/(\r\n|\n|\r)/gm, " "); //normalize the string: remove new lines
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
    let greeting = this.get('greeting');
    let text = `<p>${greeting}</p><br>`;

    if (this.get('filteredSelections.length') > 0) {
      this.get('filteredSelections').forEach((s) => {
        let who = this.get('who');

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

        this.get('filteredComments').forEach((comment) => {
          let selId = this.get('utils').getBelongsToId(comment, 'selection');
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

  shortText: function () {
    if (typeof this.get('model.text') !== 'string') {
      return '';
    }
    return this.get('model.text').slice(0, 150);
  }.property('model.text'),

  createRevision() {
    let record = this.get('store').createRecord('response', {
      recipient: this.get('recipient'),
      createdBy: this.get('currentUser'),
      submission: this.get('submission.content'),
      workspace: this.get('workspace'),
      selections: this.get('model.selections.content'),
      comments: this.get('model.comments.content'),
      status: this.get('newReplyStatus') ,
      responseType: this.get('newReplyType'),
      source: 'submission',
    });

    this.set('model.status', 'superceded');
    return Ember.RSVP.hash({
      revision: record.save(),
      original: this.get('model').save()
    })
    .then((hash) => {
      this.set('isRevising', false);
      // handle success
      this.get('alert').showToast('success', 'Revision Created', 'bottom-end', 3000, false, null);
    });
  },
  moreDetailsLinkText: function() {
    if (this.get('showDetails')) {
      return 'Hide Details';
    }
    return 'More Details';
  }.property('showDetails'),

  getQuillErrors() {
    let errors = [];
    if (this.get('isQuillEmpty')) {
      errors.addObject('emptyReplyError');
    }
    if (this.get('isQuillTooLong')) {
      errors.addObject('quillTooLongError');
    }
    return errors;
  },

  returnSizeDisplay(bytes) {
    if(bytes < 1024) {
      return bytes + ' bytes';
    } else if(bytes >= 1024 && bytes < 1048576) {
      return (bytes/1024).toFixed(1) + 'KB';
    } else if(bytes >= 1048576) {
      return (bytes/1048576).toFixed(1) + 'MB';
    }
  },

  quillTooLongErrorMsg: function() {
    let len = this.get('quillText.length');
    let maxLength = this.get('maxResponseLength');
    let maxSizeDisplay = this.returnSizeDisplay(maxLength);
    let actualSizeDisplay = this.returnSizeDisplay(len);

    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
  }.property('quillText.length', 'maxResponseLength'),

  clearErrorProps() {
    this.removeMessages(this.get('errorPropsToRemove'));
  },

  actions: {
    toggleProperty: function (p) {
      this.toggleProperty(p);
    },
    saveResponse(isDraft) {
      let quillErrors = this.getQuillErrors();

      if (quillErrors.length > 0) {
        quillErrors.forEach(errorProp => {
          this.set(errorProp, true);
        });
        return;
      }

      let response = this.get('model');

      let toastMessage =  isDraft ? 'Draft Saved' : 'Response Sent';
      let newStatus = isDraft ? 'draft' : this.get('newReplyStatus');

      response.setProperties({
        original: this.get('originalText'),
        createdBy: this.get('currentUser'),
        status: newStatus,
        responseType: this.get('newReplyType'),
        text: this.get('quillText'),
        note: this.get('replyNote')
      });

      this.get('loading').handleLoadingMessage(this, 'start', 'isReplySending', 'doShowLoadingMessage');

      response.save()
        .then((savedResponse) => {
          this.get('loading').handleLoadingMessage(this, 'end', 'isReplySending', 'doShowLoadingMessage');

          this.get('alert').showToast('success', toastMessage, 'bottom-end', 3000, false, null);
          this.get('handleResponseThread')(savedResponse, 'mentor');
          this.get('onSaveSuccess')(this.get('submission'), savedResponse);
        })
        .catch((err) => {
          this.get('loading').handleLoadingMessage(this, 'end', 'isReplySending', 'doShowLoadingMessage');

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
    }
  },
});
