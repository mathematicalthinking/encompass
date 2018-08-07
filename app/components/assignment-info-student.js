Encompass.AssignmentInfoStudentComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isResponding: false,
  displayedAnswer: null,

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

  didReceiveAttrs: function() {
    if (this.assignment) {
      console.log('assignment in route', this.assignment);
      let dateTime = 'YYYY-MM-DD';
    let dueDate = this.assignment.get('dueDate');
    let assignedDate = this.assignment.get('assignedDate');
    console.log('dueDate', dueDate);
    console.log('assignedDate', assignedDate);
    this.set('formattedDueDate', moment(dueDate).format(dateTime));
    this.set('formattedAssignedDate', moment(assignedDate).format(dateTime));
    return this.getAnswers()
    .then((answers) => {
      let filtered = answers.filterBy('assignment.id', this.assignment.id);
      console.log('filtered', filtered);
      this.set('answers', filtered);
    })
    .catch((err) => {
      console.log(err);
    });
    }


  },

  actions: {
    beginAssignmentResponse: function() {
      this.set('isResponding', true);
    },

    reviseAssignmentResponse: function() {
      this.set('isRevising', true);
    },

    cancelResponse: function() {
      console.log('cancelling response');
      if (this.get('isResponding')) {
        this.set('isResponding', false);
      } else if (this.get('isRevising')) {
        this.set('isRevising', false);
      }
    },

    toAnswerInfo: function(answer) {
      this.sendAction('toAnswerInfo', answer);
    },
    displayAnswer: function(answer) {
      //this.set('isDisplayingAnswer', true);
      this.set('displayedAnswer', answer);
    }
  }

});
