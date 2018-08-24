/**
  * # Response Controller
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.3
*/
Encompass.ResponseController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  responses: Ember.inject.controller(),
  editing: false,
  anonymous: false,
  showExisting: false,
  notEditing: Ember.computed.not('editing'),
  notPersisted: Ember.computed.not('persisted'),
  notDirty: Ember.computed.not('dirty'),
  cantRespond: Ember.computed.not('canRespond'),
  showHelp: false,
  confirmLeaving: Ember.computed.and('editing', 'dirty'),

  resizeDisplay: function () {
    Ember.run.next(this, Ember.verticalSizing);
  }.observes('showDetails', 'editing'),

  existingResponses: function () {
    var source = this.get('model.source');
    var controller = this;
    return this.get('responses.model').filter(function (response) {
      if (!response.get('persisted')) {
        return false;
      }
      if (response.get(source) !== controller.get(source)) {
        return false;
      }
      if (response.get('id') === controller.get('id')) {
        return false;
      }
      return true;
    });
  }.property('responses.model', 'submission', 'workspace', 'folder'),

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
    return (this.get('model.selections.length') === 0 && !this.get('editing') && !this.get('model.text'));
  }.property('editing', 'model.selections', 'model.text'),

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
    var controller = this;
    return this.get('student');
  }.property('student', 'to', 'anonymous'),

  greeting: function () {
    var controller = this;
    var promise = new Ember.RSVP.Promise(function (resolve, reject) {
      controller.get('model.submission').then(function (sub) {
        var brk = controller.get('model.student').indexOf(' ');
        var firstname = (brk === -1) ? controller.get('model.student') :
          controller.get('model.student').substr(0, brk);

        //return 'Hello %@,'.fmt(firstname);
        resolve(`Hello ${firstname},`);
      });
    });
    return promise;
  }.property('who'),

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

  response: function () {
    var controller = this;
    //var text = '%@\n\n'.fmt( controller.get('greeting') );
    var greeting = controller.get('greeting');
    var text = `${greeting}\n\n`;
    var promise = new Ember.RSVP.Promise(function (resolve, reject) {
      controller.get('model.selections').then(function (selections) {
        if (selections) {
          selections.forEach(function (s) {
            //text += '%@1 wrote: \n\n%@2'.fmt(controller.get('who'), controller.quote(s.get('text')));
            var who = controller.get('who');
            var quoteText = controller.quote(s.get('text'));
            text += `${who} wrote: \n\n${quoteText}`;

            controller.get('model.comments')
              .filterBy('selection.id', s.get('id'))
              .forEach(function (c) {
                var opts = {
                  type: c.get('label'),
                  usePrefix: true,
                };

                text += controller.quote(c.get('text'), opts);
                resolve(text);
              });
          });
        }
      });
    });
    //return text;
  }.property('model.selections.isFulfilled', 'model.comments.isFulfilled', 'model.comments.@each.id', 'model.selections.@each.id', 'who', 'model.id'),

  shortText: function () {
    return this.get('model.text').substring(0, 100);
  }.property('model.text'),

  _persistThen: function (callback) {
    var controller = this;
    this.set('editing', false);
    var response = this.get('model');
    var currentUser = this.get('currentUser');
    var student = controller.get('model.student');
    console.log('student is save response is', student);
    this.get('store').queryRecord('user', {
      username: student,
    }).then((student) => {
      var response = this.get('model');
      console.log('student id from query is', student.id);
      response.set('recipient', student);
      response.set('original', this.get('response'));
      response.set('createdBy', currentUser);
      response.save().then(function (saved) {
        if (callback instanceof Function) {
          callback(saved);
        }
      });
    });
  },

  actions: {
    toggleProperty: function (p) {
      this.toggleProperty(p);
    },
    save: function () {
      var controller = this;
      this._persistThen(function (saved) {
        controller.transitionToRoute('response', saved);
      });
    },
    sendToPoW: function () {
      var controller = this;
      this._persistThen(function (saved) {
        var message = '<pre>' + controller.get('model.text') + '</pre>';
        var powId = controller.get('model.powId');
        var uri = /new.*/;
        var src = window.location.href.replace(uri, saved.get('id')); //ENC-607 No longer a new submission, now saved at a different location
        console.info('sending user to pow for submission: ' + powId);
        console.info(src);

        window.open('/encpows/response-flow.do?submissionId=' + powId + '&message=' + encodeURIComponent(message) + '&notepad=' + encodeURIComponent(src));
      });
    }
  }
});
