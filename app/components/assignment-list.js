Encompass.AssignmentListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  assignmentList: function() {
    console.log('recalculating assignmentList');
    return this.assignments.filterBy('isTrashed', false);
  }.property('assignments.@each.isTrashed'),

});
