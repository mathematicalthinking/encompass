Encompass.DashboardWorkspacesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),
  myLinkedAssignments: null,

  didReceiveAttrs: function() {
    // this.yourLinkedAssignments();
    // console.log("helo", this.myLinkedAssignments);
  },

  yourLinkedAssignments: function () {
    const workspaces = this.workspaces;
    let assignments = this.assignments;

    const workspaceLinkedAssignmentIds = {};


    workspaces.forEach(workspace => {
      console.log(workspace);
      if (        workspace._internalModel.__relationships.initializedRelationships
          .linkedAssignment &&
        workspace._internalModel.__relationships.initializedRelationships
          .linkedAssignment.canonicalState.id
      ) {
        workspaceLinkedAssignmentIds[workspace.id] =
          workspace._internalModel.__relationships.initializedRelationships.linkedAssignment.canonicalState.id;
      }

    });

    assignments = assignments.filter(assignment => {
      return [];
    });

    this.myLinkedAssignments = assignments;
  }

});
