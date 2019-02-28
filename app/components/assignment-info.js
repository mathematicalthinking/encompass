Encompass.AssignmentInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  utils: Ember.inject.service('utility-methods'),

  currentAssignment: null,

  nonTrashedAnswers: function() {
    return this.get('storeAnswers').rejectBy('isTrashed');
  }.property('storeAnswers.@each.isTrashed'),

  currentProblem: function() {
    let assignment = this.get('currentAssignment');
    if (!assignment) {
      return null;
    }
    return assignment.get('problem.content');
  }.property('currentAssignment.problem.content'),

  currentSection: function() {
    let assignment = this.get('currentAssignment');
    if (!assignment) {
      return null;
    }
    return assignment.get('section.content');
  }.property('currentAssignment.section.content'),

  assignmentAnswers: function() {
    let assignmentId = this.get('currentAssignment.id');
    if (!assignmentId) {
      return [];
    }
    return this.get('nonTrashedAnswers').filter((answer) => {
      let assnId = this.get('utils').getBelongsToId(answer, 'assignment');
      return assnId === assignmentId;
    });
  }.property('currentAssignment.id', 'nonTrashedAnswers.[]'),

  assignmentStudents: function() {
    let assignment = this.get('currentAssignment');
    if (!assignment) {
      return [];
    }
    return assignment.get('students.content');

  }.property('currentAssignment.students.content'),

  didReceiveAttrs: function() {
    if (this.get('assignment.id') !== this.get('currentAssignment.id')) {
      this.set('currentAssignment', this.get('assignment'));
      this.set('storeAnswers', this.get('store').peekAll('answer'));
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
