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
  }.observes('assignments.@each.isTrashed', 'currentUser.isStudent'),


  yourList: function() {
    let currentUser = this.get('currentUser');
    let yourList = this.assignments.filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreator = assignment.get('createdBy');
      return userId === assigmentCreator.get('id') && !assignment.get('isTrashed');
    });
    return yourList.sortBy('createDate').reverse();
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent'),


  adminList: function() {
    let currentUser = this.get('currentUser');
    let adminList = this.get('assignmentList').filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreator = assignment.get('createdBy');
      return userId !== assigmentCreator.get('id') && !assignment.get('isTrashed');
    });
    return adminList.sortBy('createDate').reverse();
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent'),

  pdList: function () {
    let currentUser = this.get('currentUser');
    let pdList = this.get('assignmentList').filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreator = assignment.get('createdBy');
      return userId !== assigmentCreator.get('id') && !assignment.get('isTrashed');
    });
    return pdList.sortBy('createDate').reverse();
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent'),

});


