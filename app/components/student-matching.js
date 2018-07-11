Encompass.StudentMatchingComponent = Ember.Component.extend({
  matchingStudentsError: null,
  actions: {
    reviewAnswers: function() {
      console.log('reviewingAnswers');
      let studentDropdowns = this.$('#student-matching select');
      for (let select of studentDropdowns) {
        if (Ember.isEmpty(select.value)) {
          this.set('matchingStudentsError', true);
          return;
        }
      }
      console.log('getting reviewSubmissions');
      this.get('reviewSubmissions')();
    }
  },


});