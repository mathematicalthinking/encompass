Encompass.StudentMatchingComponent = Ember.Component.extend({
  matchingStudentsError: null,
  actions: {
    formatAnswers: function() {
      let studentDropdowns = this.$('#student-matching select');
      for (let select of studentDropdowns) {
        if (Ember.isEmpty(select.value)) {
          this.set('matchingStudentsError', true);
          return;
        }
      }
      this.get('uploadAnswers')();
    }
  }

});