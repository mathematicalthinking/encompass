Encompass.ImportWorkStep4Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step4',

  actions: {
    checkStatus: function() {
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
      this.get('onProceed')();
      return;
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});