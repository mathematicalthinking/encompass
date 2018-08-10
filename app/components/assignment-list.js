Encompass.AssignmentListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  didReceiveAttrs: function() {
    this.filterAssignments();

  },
  filterAssignments: function() {
    const filtered = this.assignments.filter((assignment) => {
      return assignment.id && !assignment.get('isTrashed');
    });
    this.set('assignmentList', filtered);
  }.observes('assignments.@each.isTrashed'),


});
