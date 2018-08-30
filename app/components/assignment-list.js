Encompass.AssignmentListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  didReceiveAttrs: function() {
    this.filterAssignments();

  },
  filterAssignments: function() {
    let filtered = this.assignments.filter((assignment) => {
      return assignment.id && !assignment.get('isTrashed');
    });
    filtered = filtered.sortBy('createDate').reverse();
    this.set('assignmentList', filtered);
  }.observes('assignments.@each.isTrashed'),


});
