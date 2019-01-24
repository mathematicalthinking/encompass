Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {

  currentAssignment: null,

  didReceiveAttrs: function() {
    if (this.get('assignment.id') !== this.get('currentAssignment.id')) {
      this.set('currentAssignment', this.get('assignment'));

      let promiseHash = {
        section: this.get('assignment.section'),
        problem: this.get('assignment.problem'),
        linkedWorkspace: this.get('assignment.linkedWorkspace')
      };

      if (this.get('currentUser.isStudent')) {
        promiseHash.studentAnswers = this.get('store').query('answer', {
          filterBy: {
            createdBy: this.get('currentUser.id'),
            assignment: this.get('assignment.id')
          }
        });
      } else {
        promiseHash.assignmentAnswers = this.get('store').query('answer', {
          filterBy: {
            assignment: this.get('assignment.id')
          }
        });
        promiseHash.assignmentStudents = this.get('assignment.students');
      }

      return Ember.RSVP.hash(promiseHash)
      .then((hash) => {
        this.set('problem', hash.problem);
        this.set('section', hash.section);
        this.set('linkedWorkspace', hash.linkedWorkspace);

        if (hash.studentAnswers) {
          this.set('studentAnswers', hash.studentAnswers.toArray());
        }

        if (hash.assignmentAnswers) {
          this.set('assignmentAnswers', hash.assignmentAnswers.toArray());
        }

        if (hash.assignmentStudents) {
          this.set('assignmentStudents', hash.assignmentStudents);
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
