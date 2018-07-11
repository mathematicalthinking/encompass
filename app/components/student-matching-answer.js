Encompass.StudentMatchingAnswerComponent = Ember.Component.extend({
  assignedStudent: null,
  section: null,
  submission: null,
  isPdf: null,

  didInsertElement: function() {
    var section = this.get('selectedSection');
    var answer = this.get('answer');
    if (answer.explanation.data) {
      var isPdf = answer.explanation.data.includes('application/pdf');
      this.set('isPdf', isPdf);
    }
    this.set('section', section);
    this.set('submission', answer);

  },
  actions: {
    updateAnswer: function(student) {
      this.set('assignedStudent', student);
      var studentId = student.get('id');
      var ans = this.get('submission');
      ans.student = student;
      //ans.studentId = student.id;
      this.set('submission', ans);
      var imageId = ans.explanation.id;
    }
  }





});
