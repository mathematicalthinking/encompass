Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isEditing: false,
  isDisplaying: Ember.computed.not('isEditing'),

  getAnswers: function() {
    return this.store.findAll('answer');
},

  sortedAnswers: function() {
    if (this.get('answers')) {
      return this.get('answers').sortBy('createDate').reverse();
    }
    return [];
  }.property('answers.[]'),

  priorAnswer: function() {
    return this.get('sortedAnswers').get('firstObject');
  }.property('sortedAnswers.[]'),


  isProblemLocked: function() {
    //can be edited only if no submissions have been recorded yet
    return !Ember.isEmpty(this.get('answers')) || this.get('isDisplaying');
  }.property('answers.[]', 'isDisplaying'),

  didReceiveAttrs: function() {
    if (this.assignment) {
      let dateTime = 'YYYY-MM-DD';
      let dueDate = this.assignment.get('dueDate');
      let assignedDate = this.assignment.get('assignedDate');
      this.set('formattedDueDate', moment(dueDate).format(dateTime));
      this.set('formattedAssignedDate', moment(assignedDate).format(dateTime));
      return this.getAnswers()
      .then((answers) => {
        let filtered = answers.filterBy('assignment.id', this.assignment.id);
        this.set('answers', filtered);
      })
      .catch((err) => {
        console.log(err);
      });
    }
  },

  actions: {
    editAssignment: function() {
      this.set('isEditing', true);
    },

    deleteAssignment: function() {
      console.log('deleting assignment');
    },
    updateAssignment: function() {
      const assignment = this.get('assignment');

      const values = ['selectedSection', 'selectedProblem', 'assignedDate', 'dueDate'];

      for (let value of values) {

      }

      for (let input of input) {

      }
      },
    stopEditing: function() {
      this.set('isEditing', false);
    }
  }

});
