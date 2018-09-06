Encompass.StudentMatchingAnswerComponent = Ember.Component.extend({
  assignedStudent: null,
  section: null,
  submission: null,
  isPdf: null,

  didInsertElement: function() {
    var section = this.get('selectedSection');
    var answer = this.get('answer');
    this.set('section', section);
    this.set('submission', answer);

  },
  actions: {
    updateAnswer: function(student) {
      this.set('assignedStudent', student);
      var ans = this.get('submission');
      ans.student = student;
      this.set('submission', ans);

      this.get('checkStatus')();
    }
  }





});
