Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  utils: Ember.inject.service('utility-methods'),

  currentAssignment: null,

  didReceiveAttrs: function() {
    if (this.get('assignment.id') !== this.get('currentAssignment.id')) {
      this.set('currentAssignment', this.get('assignment'));

      let isStudent = this.get('currentUser.isStudent');

      let promiseHash = {
        section: this.get('assignment.section'),
        problem: this.get('assignment.problem'),
      };

      return Ember.RSVP.hash(promiseHash)
        .then((results) => {
          this.set('problem', results.problem);
          this.set('section', results.section);

          let hash = {
            answers: this.get('assignment.answers')
          };
          if (!isStudent) {
            hash.students = this.get('assignment.students');
          }
          return Ember.RSVP.hash(hash);
        })
        .then((results) => {
          if (isStudent) {
            this.set('studentAnswers', results.answers);
          } else {
            this.set('assignmentAnswers', results.answers);
            this.set('assignmentStudents', results.students);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'initialLoadErrors');
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
