Encompass.DashboardWorkspaceRowComponent = Ember.Component.extend({
  tagName: "",
  myAssignment: null,
  student: "",

  didReceiveAttrs: function () {
    this.singleAssignment();
  },

  singleAssignment() {


    this.myAssignment = this.assignments.find((assignment) => {
      return assignment.id === this.linkedAssignments[this.workspace.id];
    });
    const ws = this.workspace;
    // const owner = ws.get('owner');
    // console.log(ws.get('owner'));
  },
});
