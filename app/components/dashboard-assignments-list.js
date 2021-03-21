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
      const assignedStudents = assignment.get('students').content.currentState.map(student => student.id);
      return assignedStudents.includes(userId) && !assignment.get('isTrashed');
    });
    this.tableHeight = yourList.length * 31 + "px";
    return yourList;
  }.property('assignments.@each.isTrashed', 'currentUser.isStudent')
});


