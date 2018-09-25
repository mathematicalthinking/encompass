Encompass.AssignmentInfoStudentComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isResponding: false,
  displayedAnswer: null,
  answerList: [],
  isLoadingAnswers: null,
  findRecordErrors: [],

  init: function() {
    this._super(...arguments);
    this.set('isLoadingAnswers', true);
    return this.getAnswers().then((answers) => {
      this.set('answerList', answers);
      this.set('isLoadingAnswers', false);
    });
  },

  getAnswers: function() {
    const student = this.get('currentUser');
    return student.get('answers')
    .catch((err) => {
      this.handleErrors(err, 'findRecordErrors');
    });
  },

  filteredList: function() {
    const answers = this.get('answerList');
      if (this.get('isLoadingAnswers')) {
        return [];
      } else {
        return answers.filterBy('assignment.id', this.assignment.id);
      }
    }.property('answerList.[]', 'assignment.id'),

  sortedList: function() {
    const filtered = this.get('filteredList');
    return filtered.sortBy('createDate').reverse();
  }.property('filteredList.[]'),

  priorAnswer: function() {
    return this.get('sortedList').get('firstObject');
  }.property('sortedList.[]'),

  didReceiveAttrs: function() {
    if (this.assignment) {
    if (this.get('displayedAnswer')) {
      this.set('displayedAnswer', null);
    }
    this.toggleResponse();

    let dateTime = 'YYYY-MM-DD';
    let dueDate = this.assignment.get('dueDate');
    let assignedDate = this.assignment.get('assignedDate');
    this.set('formattedDueDate', moment(dueDate).format(dateTime));
    this.set('formattedAssignedDate', moment(assignedDate).format(dateTime));
  }
},
toggleResponse: function() {
  if (this.get('isResponding')) {
    this.set('isResponding', false);
  } else if (this.get('isRevising')) {
    this.set('isRevising', false);
  }
},

  actions: {
    beginAssignmentResponse: function() {
      this.set('isResponding', true);
      if (this.get('answerCreated')) {
        this.set('answerCreated', false);
      }
    },

    reviseAssignmentResponse: function() {
      this.set('isRevising', true);
      if (this.get('answerCreated')) {
        this.set('answerCreated', false);
      }
    },

    toAnswerInfo: function(answer) {
      this.sendAction('toAnswerInfo', answer);
    },
    displayAnswer: function(answer) {
      //this.set('isDisplayingAnswer', true);
      if (this.get('answerCreated')) {
        this.set('answerCreated', false);
      }
      this.set('displayedAnswer', answer);
    },

    handleCreatedAnswer: function(answer) {
      this.set('answerCreated', true);
      this.toggleResponse();
      this.get('answerList').pushObject(answer);
    },

    cancelResponse: function() {
      this.toggleResponse();

    },
  }

});
