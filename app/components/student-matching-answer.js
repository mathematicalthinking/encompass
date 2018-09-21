Encompass.StudentMatchingAnswerComponent = Ember.Component.extend({
  assignedStudent: null,
  section: null,
  submission: null,
  assignedStudents: [],
  defaultStudentList: null,

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
    }
  }
});
