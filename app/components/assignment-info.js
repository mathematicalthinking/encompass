Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  didReceiveAttrs: function() {
    console.log('receive attrs assn-info');
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
