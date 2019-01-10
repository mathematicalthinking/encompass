/*global _:false */
Encompass.StudentMatchingAnswerComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['student-matching-answer'],
  utils: Ember.inject.service('utility-methods'),

  section: null,
  submission: null,
  isExpanded: false,
  selectedIds: [],

  selectizeInputId: function() {
    let id = this.get('answer.explanationImage.id') || '';
    return `select-add-student${id}`;
  }.property('answer.id'),

  didReceiveAttrs: function() {
    const section = this.get('selectedSection');
    const answer = this.get('answer');
    const image = answer.explanationImage;
    this.set('image', image);

    this.set('section', section);
    this.set('submission', answer);

    if (!Array.isArray(this.get('submission.students'))) {
      this.set('submission.students', []);
    }
    if (!Array.isArray(this.get('submission.studentNames'))) {
      this.set('submission.studentNames', []);
    }

  },

  initialStudentItems: function() {
    let userItems = this.get('submission.students').mapBy('id');
    let nameItems = this.get('submission.studentNames');
    return userItems.pushObjects(nameItems);
  }.property('submission.students.[]', 'submission.studentNames.[]'),

  studentOptions: function() {
    if (!this.get('studentMap')) {
      return [];
    }
    let options = [];
    let selectedIds = this.get('selectedIds') || [];

    _.each(this.get('studentMap'), (val, key) => {
      if (!selectedIds.includes(val)) {
        options.addObject({
          id: val.get('id'),
          username: val.get('username')
        });
      }
    });
    _.each(this.get('addedStudentNames'), (name) => {
      options.addObject({
        id: name,
        username: name
      });
    });
    return options;
  }.property('selectedIds.[]', 'studentMap', 'addedStudentNames.[]'),

  updateAnswer(userId, doRemove) {
    if (!userId) {
      return;
    }

    let isMongoId = this.get('utils').isValidMongoId(userId);

    let creators;
    let userObj;

    // add or remove encompass user from students array on answer object
    if (isMongoId) {
      creators = this.get('submission.students');
      userObj = creators.findBy('id', userId);
      if (doRemove) {
        creators.removeObject(userObj);
      } else {
        creators.addObject(this.get('studentMap')[userId]);
      }
    // add or remove string name from studentNames array on answer object
    } else {
      creators = this.get('submission.studentNames');
      userObj = creators.find((name) => {
        return name === userObj;
      });
      if (doRemove) {
        creators.removeObject(userObj);
      } else {
        creators.addObject(userId);
        // keep track of which string name items have been added
        // once user creates item for one answer, it should be available on other answers to select
        this.get('addedStudentNames').addObject(userId);
      }
    }
    // check if all answers have been assigned at least one student
    this.get('checkStatus')();
  },

  actions: {
    //val will either be mongo objectId of encompass user or string name added by user
    updateSelectedIds: function(val, $item) {
      if (!val) {
        return;
      }
      let doRemove;
      if (_.isNull($item)) {
        this.get('selectedIds').removeObject(val);
        doRemove = true;
      } else {
        this.get('selectedIds').addObject(val);
        doRemove = false;
      }

      this.updateAnswer(val, doRemove);
    },
    expandImage: function () {
      this.set('isExpanded', !this.get('isExpanded'));
    },

    // runs when creating item in selectize control
    // used for adding non encompass users which will be added to studentNames array
    addStudentName: function(input, cb) {
      if (typeof input !== 'string') {
        return;
      }
      let trimmed = input.trim();

      return cb({
        username: trimmed,
        id: trimmed
      });
    },

  }
});
