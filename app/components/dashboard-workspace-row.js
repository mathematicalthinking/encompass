Encompass.DashboardWorkspaceRowComponent = Ember.Component.extend({
  tagName: "",
  myAssignment: null,
  student: "",

  didReceiveAttrs: function () {
    this.singleAssignment();
  },

  singleAssignment() {

    if (this.linkedAssignments && this.workspace && this.assignments) {
      // find student that has a workspace that matches the workspace we're on
      // loop through students find linkedWorkspace




      const assingmentId = this.linkedAssignments[this.workspace.id];
      const assignment = this.assignments.find((a) => {
        return a.id === assingmentId;
      });

      this.myAssignment = assignment;
      console.log('single assignment',this.myAssignment);
    }
  },
});
