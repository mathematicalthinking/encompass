Encompass.StudentMatchingAnswerComponent = Ember.Component.extend({
  assignedStudent: null,
  section: null,
  submission: null,

  didReceiveAttrs: function() {
    const section = this.get('selectedSection');
    const answer = this.get('answer');
    const image = answer.explanationImage;
    this.set('image', image);

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
