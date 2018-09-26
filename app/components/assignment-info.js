Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {

  didReceiveAttrs: function() {
    const assignment = this.assignment;

    if (assignment) {
      return assignment.get('section')
      .then((section) => {
        this.set('section', section);
        return assignment.get('problem');
      })
      .then((problem) => {
        this.set('problem', problem);
        return;
      })
      .catch((err) => {
        this.handleErrors(err, 'initialLoadErrors');
        console.log('err',err);
      });
    }
  },

  actions: {
    toAssignments: function() {
      this.sendAction('toAssignments');
    },

    toAnswerInfo: function(answer) {
      this.sendAction('toAnswerInfo', answer);
    },
  }
});
