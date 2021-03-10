Encompass.DashboardAssignmentsListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {

  utils: Ember.inject.service('utility-methods'),
  tableHeight: '',

  didReceiveAttrs: function() {
    this.filterAssignments();
  },

  filterAssignments: function() {
    let currentUser = this.get('currentUser');
    let filtered = this.assignments.filter((assignment) => {
      return assignment.id && !assignment.get('isTrashed');
    });
    filtered = filtered.sortBy('createDate').reverse();
    if (currentUser.get('accountType') === 'S') {
      // what is this if block for?
      // console.log('current user is a student');
    }
    // let currentDate = new Date();
    this.set('assignmentList', filtered);
  }.observes('assignments.@each.isTrashed', 'currentUser.isStudent'),


  yourList: function() {
    let currentUser = this.get('currentUser');
    let yourList = this.assignments.filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreatorId = this.get('utils').getBelongsToId(assignment, 'createdBy');
      return userId === assigmentCreatorId && !assignment.get('isTrashed');
    });
    this.tableHeight = yourList.length * 31 + "px";
    return yourList.sortBy('createDate').reverse();
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent'),


  adminList: function() {
    let currentUser = this.get('currentUser');
    let adminList = this.get('assignmentList').filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreatorId = this.get('utils').getBelongsToId(assignment, 'createdBy');
      return userId !== assigmentCreatorId && !assignment.get('isTrashed');
    });
    return adminList.sortBy('createDate').reverse();
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent'),

  pdList: function () {
    let currentUser = this.get('currentUser');
    let pdList = this.get('assignmentList').filter((assignment) => {
      let userId = currentUser.get('id');
      let assigmentCreatorId = this.get('utils').getBelongsToId(assignment, 'createdBy');
      return userId !== assigmentCreatorId && !assignment.get('isTrashed');
    });
    return pdList.sortBy('createDate').reverse();
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent'),

});


