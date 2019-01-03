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
  selectedStudents: [],

  didReceiveAttrs: function() {
    const section = this.get('selectedSection');
    const answer = this.get('answer');
    console.log('answer is', answer);
    const image = answer.explanationImage;
    this.set('image', image);

    this.set('section', section);
    this.set('submission', answer);

    if (section) {
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
    } else {
      this.get('store').findAll('user').then((users) => {
        let mapped = _.map(users, (user) => {
          return {
            id: user.id,
            username: user.get('username')
          };
        });
        this.set('students', mapped);
      });
    }

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
    updateSelectedStudents(val, $item) {
      if (!val) {
        return;
      }
      let selectedStudents = this.get('selectedStudents');
      if (_.isNull($item)) {
        let studentToRemove = selectedStudents.findBy('id', val);
        if (studentToRemove) {
          selectedStudents.removeObject(studentToRemove);
          return;
        }
      }
      let record = this.get('store').peekRecord('user', val);
      if (record) {
        selectedStudents.addObject(record);
      }

      let ans = this.get('submission');
      ans.students = this.get('selectedStudents');
      this.get('checkStatus')();
    },
    expandImage: function () {
      this.set('isExpanded', !this.get('isExpanded'));
    },
  }
});
