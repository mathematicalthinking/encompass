Encompass.StudentMatchingComponent = Ember.Component.extend({
  matchingStudentsError: null,
  isReadyToReviewAnswers: null,

  actions: {
    reviewAnswers: function() {
      console.log('reviewingAnswers');
      this.get('reviewSubmissions')();
    },
    checkStatus: function() {
      console.log('checking status');
      let answers = this.get('answers');

      answers.forEach((ans) => {
        let students = ans.students;
        if (!students || Ember.isEmpty(students)) {
          this.set('isReadyToReviewAnswers', false);
          return;
        }
        this.set('isReadyToReviewAnswers', true);
      });
    }
  },


});