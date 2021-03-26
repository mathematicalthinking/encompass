Encompass.DashboardWorkspaceRowComponent = Ember.Component.extend({
  tagName: "",
  myAssignment: null,
  student: "",

  didReceiveAttrs: function () {
    this.singleAssignment();
  },

  singleAssignment() {
    this.myAssignment = this.workspace.get('linkedAssignment');
  },
});
