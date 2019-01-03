/*global _:false */
Encompass.StudentMatchingAnswerComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  elementId: 'student-matching-answer',
  assignedStudent: null,
  section: null,
  submission: null,
  assignedStudents: [],
  defaultStudentList: null,
  loadStudentsErrors: [],
  isExpanded: false,

  init: function() {
    this._super(...arguments);
    this.set('notFoundTemplate', `<p class="tt-notfound">No matches found.</p>`);
  },

  didReceiveAttrs: function() {
    const section = this.get('selectedSection');
    const answer = this.get('answer');
    const image = answer.explanationImage;
    this.set('image', image);

    this.set('section', section);
    this.set('submission', answer);

    Promise.resolve(section.get('students')).then((students) => {
      let toArray = students.toArray();
      let mapped = _.map(toArray, (user) => {
        return {
          id: user.id,
          username: user.get('username')
        };
      });
      this.set('students', mapped);
    }).catch((err) => {
      this.handleErrors(err, 'loadStudentsErrors');
    });
  },

  addStudent: function() {
    let s = this.get('studentToAdd');
    if (!s) {
      return;
    }
    let ans = this.get('submission');
    if (!this.get('creators')) {
      this.set('creators', []);
    }

  if (this.get('creators').includes(s)) {
    this.set('studentToAdd', null);
    return;
  }

    this.get('creators').pushObject(s);

    ans.students = this.get('creators');
    this.set('studentToAdd', null);
    this.get('checkStatus')();
  }.observes('studentToAdd'),


  actions: {
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
    updateSelectizeSingle(val, $item, propToUpdate, model) {
      if (_.isNull($item)) {
        this.set(propToUpdate, null);
        return;
      }
      let record = this.get('store').peekRecord(model, val);
      if (!record) {
        return;
      }
      this.set(propToUpdate, record);
    },
    expandImage: function () {
      this.set('isExpanded', !this.get('isExpanded'));
    },
  }
});
