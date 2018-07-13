Encompass.StudentMatchingComponent = Ember.Component.extend({
  matchingStudentsError: null,
  isReadyToReviewAnswers: null,

  actions: {
    reviewAnswers: function() {
      console.log('reviewingAnswers');
      // let studentDropdowns = this.$('.student-matching select');
      // for (let select of studentDropdowns) {
      //   if (Ember.isEmpty(select.value)) {
      //     this.set('matchingStudentsError', true);
      //     return;
      //   }
      // }
      this.get('reviewSubmissions')();
    },
    checkStatus: function() {
      console.log('checking status');
      let studentDropdowns = this.$('.student-matching select');
      for (let select of studentDropdowns) {
        if (Ember.isEmpty(select.value)) {
          this.set('isReadyToReviewAnswers', false);
          return;
        }
      }
      this.set('isReadyToReviewAnswers', true);
    }
  },


});