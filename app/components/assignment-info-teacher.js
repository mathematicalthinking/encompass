Encompass.AssignmentInfoTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  formattedDueDate: null,
  formattedAssignedDate: null,

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

  isEditable: function() {
    //can be edited only if no submissions have been recorded yet
    return Ember.isEmpty(this.get('answers'));
  }.property('answers.[]'),

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

  }

});
