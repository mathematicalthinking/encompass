Encompass.StudentMatchingAnswerComponent = Ember.Component.extend({
  assignedStudent: null,
  section: null,
  submission: null,
  assignedStudents: [],

  didReceiveAttrs: function() {
    const section = this.get('selectedSection');
    const answer = this.get('answer');
    const image = answer.explanationImage;
    this.set('image', image);

    this.set('section', section);
    this.set('submission', answer);

    Promise.resolve(section.get('students')).then((students) => {
      this.set('students', students);
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
    this.get('creators').pushObject(s);

    ans.students = this.get('creators');
    this.set('studentToAdd', null);
  }.observes('studentToAdd'),


  actions: {
    updateAnswer: function(student) {
      // arg is string username of student
      let user = this.get('students').findBy('username', student);

      this.set('studentToAdd', user);
      this.get('checkStatus')();
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
    }
  }
});
