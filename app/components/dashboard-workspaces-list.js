Encompass.DashboardAssignmentsListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  // utils: Ember.inject.service('utility-methods'),

  // didReceiveAttrs: function() {
  //   this.linkedAssignments();
  // },

  // linkedAssignments: function() {
  //   const currentUser = this.get('currentUser');

  //   const linkedAssignments = this.assignments.filter((assignment) => {
  //     const userId = currentUser.get('id');
  //     let assigmentCreatorId = this.get('utils').getBelongsToId(assignment, 'createdBy');
  //     return userId === assigmentCreatorId && !assignment.get('isTrashed');
  //   });
  //   return linkedAssignments.sortBy('createDate').reverse();
  // },

});
