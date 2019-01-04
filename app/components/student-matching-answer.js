/*global _:false */
Encompass.StudentMatchingAnswerComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['student-matching-answer'],
  assignedStudent: null,
  section: null,
  submission: null,
  assignedStudents: [],
  defaultStudentList: null,
  loadStudentsErrors: [],
  isExpanded: false,
  selectedStudents: [],
  selectedIds: [],

  selectizeInputId: function() {
    let id = this.get('answer.explanationImage.id') || '';
    return `select-add-student${id}`;
  }.property('answer.id'),

  didReceiveAttrs: function() {
    const section = this.get('selectedSection');
    const answer = this.get('answer');
    console.log('answer is', answer);
    const image = answer.explanationImage;
    this.set('image', image);

    this.set('section', section);
    this.set('submission', answer);

  },
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
    return options;
  }.property('selectedIds.[]', 'studentMap'),

  updateAnswer(userId, doRemove) {
    if (!userId) {
      return;
    }
    if (!Array.isArray(this.get('submission.students'))) {
      this.set('submission.students', []);
    }
    let creators = this.get('submission.students');
    let userObj = creators.findBy('id', userId);
    if (doRemove) {
      creators.removeObject(userObj);
    } else {
      creators.addObject(this.get('studentMap')[userId]);
    }
    this.get('checkStatus')();
  },



  actions: {
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
    removeStudent: function(student) {
      if (!student) {
        return;
      }
      const creators = this.get('creators');

      if (!creators) {
        return;
      }

      creators.removeObject(student);
    },
    expandImage: function () {
      this.set('isExpanded', !this.get('isExpanded'));
    },
  }
});
