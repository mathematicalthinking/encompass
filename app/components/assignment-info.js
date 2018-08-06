Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  didReceiveAttrs: function() {
    if (this.assignment) {
      const assignment = this.assignment;
      return assignment.get('section')
      .then((section) => {
        this.set('section', section);
        return assignment.get('problem');
      })
      .then((problem) => {
        this.set('problem', problem);
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
  }
});
