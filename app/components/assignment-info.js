Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,
  isResponding: false,

  sortedAnswers: function() {
    return this.get('answers').sortBy('createDate').reverse();
  }.property('answers'),

  priorAnswer: function() {
    return this.get('sortedAnswers').get('firstObject');
  }.property('sortedAnswers.[]'),

  didReceiveAttrs: function() {
    let dateTime = 'YYYY-MM-DD';
    let dueDate = this.get('assignment').get('dueDate');
    let assignedDate = this.get('assignment').get('assignedDate');
    console.log('dueDate', dueDate);
    console.log('assignedDate', assignedDate);
    this.set('formattedDueDate', moment(dueDate).format(dateTime));
    this.set('formattedAssignedDate', moment(assignedDate).format(dateTime));
    // let answers = this.get('currentUser').get('answers');
    // console.log('answers', answers);
    // console.log('id', this.assignment.id);
    // if (!Ember.isEmpty(answers)) {
    //   let prevAnswers = answers.filter((answer) => {
    //     console.log('ans', answer.get('data.assignment'));
    //     console.log(answer.get('assignment.content'));
    // });
  },

  actions: {
    beginAssignmentResponse: function() {
      this.set('isResponding', true);
    },

    reviseAssignmentResponse: function() {
      this.set('isRevising', true);
    },

    toAnswerInfo: function(answer) {
      this.sendAction('toAnswerInfo', answer);
    }
  }

});
