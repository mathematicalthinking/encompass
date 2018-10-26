Encompass.AssignmentListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  didReceiveAttrs: function() {
    this.filterAssignments();
  },

  filterAssignments: function() {
    let currentUser = this.get('currentUser');
    let filtered = this.assignments.filter((assignment) => {
      // console.log('assign date is', assignment.get('assignedDate'));
      return assignment.id && !assignment.get('isTrashed');
    });
    filtered = filtered.sortBy('createDate').reverse();
    if (currentUser.get('accountType') === 'S') {
      console.log('current user is a student');
    }
    let currentDate = new Date();
    console.log('current Date is', currentDate);

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


