/*global _:false */
Encompass.ImportWorkStep4Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step4',

  displayList: function() {
    if (!this.get('studentMap')) {
      return;
    }
    return _.map(this.get('studentMap'), (val, key) => {
      return val;
    });
  }.property('studentMap'),

  actions: {
    checkStatus: function() {
      if (this.get('isMatchingIncompleteError')) {
        this.set('isMatchingIncompleteError', null);
      }
      let answers = this.get('answers');
      console.log('checkstatus ran and answers are', answers);

      answers.forEach((ans) => {
        let students = ans.students;
        console.log('students are', students);
        if (!students || Ember.isEmpty(students)) {
          this.set('isReadyToReviewAnswers', false);
          return;
        }
        this.set('isReadyToReviewAnswers', true);
      });
    },
    next() {
      if (this.get('isReadyToReviewAnswers')) {
        this.get('onProceed')();
      } else {
        this.set('isMatchingIncompleteError', true);
      }
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});