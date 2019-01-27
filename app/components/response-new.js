
Encompass.ResponseNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'response-new',
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
  showHelp: false,
  confirmLeaving: Ember.computed.and('isEditing', 'dirty'),
  alert: Ember.inject.service('sweet-alert'),
  todaysDate: new Date(),
  doUseOnlyOwnMarkup: true,
  utils: Ember.inject.service('utility-methods'),


  didReceiveAttrs() {
    if (this.get('isCreating') && !this.get('isEditing')) {
      // this.set('isEditing', true);
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

  resizeDisplay: function () {
    Ember.run.next(this, Ember.verticalSizing);
  }.observes('showDetails', 'isEditing'),

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

  toList: function () {
    return [this.get('student'), 'workspace'];
  }.property('student'),

  canRespond: function () {
    return !this.get('isStatic');
  }.property('isStatic'),

  explainEmptiness: function () {
    return (this.get('filteredSelections.length') === 0 && !this.get('isEditing') && !this.get('isRevising') && !this.get('model.text'));
  }.property('isEditing', 'filteredSelections.[]', 'model.text', 'isRevising'),

  modelChanged: function () {
    if (!this.get('persisted') && !this.get('model.text')) {
      this.set('model.text', this.get('response'));
      this.set('to', this.get('student'));
    }
  }.observes('response', 'model.selections.@eachisLoaded', 'model.comments.@each.isLoaded'),

  updateResponse: function () {
    if (this.get('notEditing') && !this.get('persisted')) {
      this.set('model.text', this.get('response'));
    }
  }.observes('who'),

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

      var brk = this.get('model.student').indexOf(' ');
      var firstname = (brk === -1) ? this.get('model.student') :
         this.get('model.student').substr(0, brk);

        //return 'Hello %@,'.fmt(firstname);
        return `Hello ${firstname},`;

  }.property('model.student'),

  quote: function (string, opts) {
    string = string.replace(/(\r\n|\n|\r)/gm, " "); //normalize the string: remove new lines
    var defaultPrefix = '         ';
    var prefix = defaultPrefix;
    var str = '';
    var lines = [];

    if (opts && opts.hasOwnProperty('type')) {
      if (opts.usePrefix) {
        switch (opts.type) {
          case 'notice':
            prefix = '     ...and I noticed that...\n\n\t\t';
            break;
          case 'wonder':
            prefix = '     ...and I wondered about...\n\n\t\t';
            break;
          case 'feedback':
            prefix = '     ...and I thought...\n\n\t\t';
            break;
          default:
            prefix = defaultPrefix;
            break;
        }
      }
    }

    var max = (100 - prefix.length); //magic number?
    while (string.length > 0) {
      if (string.length < max) {
        str += prefix + string.trim();
        string = '';
      } else {
        var candidate = string.substring(0, max) + "\n"; //regardless of spaces
        var brk = candidate.lastIndexOf(' '); //find the last space
        str += prefix + string.substring(0, brk).trim() + "\n";
        string = string.substring(brk, string.length).trim();
        str += defaultPrefix + string.trim();
        string = '';
      }
    }
    return str + "\n\n";
  },

  preFormatText: function () {
    //var text = '%@\n\n'.fmt( this.get('greeting') );
    var greeting = this.get('greeting');
    var text = `${greeting}\n\n`;

    if (this.get('filteredSelections.length') > 0) {
      this.get('filteredSelections').forEach((s) => {
        //text += '%@1 wrote: \n\n%@2'.fmt(this.get('who'), this.quote(s.get('text')));
        var who = this.get('who');
        var quoteText = this.quote(s.get('text'));
        text += `${who} wrote: \n\n${quoteText}`;

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

  _persistThen: function (callback) {
    let response = this.get('model');
    response.set('original', this.get('originalText'));
    response.set('createdBy', this.get('currentUser'));
    response.set('status', this.get('newReplyStatus'));
    response.set('responseType', this.get('newReplyType'));
    response.set('text', this.get('replyText'));
    response.set('note', this.get('replyNote'));
    response.save().then(function (saved) {
      if (callback instanceof Function) {
        callback(saved);
      }
    });
  },

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

  actions: {
    toggleProperty: function (p) {
      this.toggleProperty(p);
    },
    save: function () {
      var controller = this;
        this._persistThen(function (saved) {
          controller.get('alert').showToast('success', 'Response Sent', 'bottom-end', 3000, false, null);
          controller.get('onSaveSuccess')(controller.get('submission'), saved);
        });
    },
    toggleOwnMarkUpOnly(e) {
      this.send('toggleProperty', 'doUseOnlyOwnMarkup');
      this.set('replyText', '');
      this.preFormatText();
    }
  },
});
