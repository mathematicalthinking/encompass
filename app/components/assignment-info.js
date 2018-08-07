Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  didReceiveAttrs: function() {
    console.log('receive attrs assn-info');
    if (this.assignment) {
      const assignment = this.get('assignment');
      return this.assignment.get('section')
      .then((section) => {
        this.set('section', section);
        return assignment.get('problem');
      })
      .then((problem) => {
        this.set('problem', problem);
        return assignment.get('answers');
      })
      .then((answers) => {
        this.set('answers', answers);
        return answers.sortBy('createDate').reverse();
      })
      .then((sorted) => {
        this.set('sortedAnswers', sorted);
        return;
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },

  actions: {
    toAssignments: function() {
      this.sendAction('toAssignments');
    },

    toAnswerInfo: function(answer) {
      console.log('toanswer info -info');
      this.sendAction('toAnswerInfo', answer);
    },
  }
});
