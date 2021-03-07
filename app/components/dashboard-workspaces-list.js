Encompass.DashboardWorkspacesListComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  utils: Ember.inject.service('utility-methods'),
  myLinkedAssignments: null,


  didReceiveAttrs: function() {
    this.yourLinkedAssignments();
  },

  yourLinkedAssignments: function () {
    const workspaces = this.workspaces;
    let assignments = this.assignments;

    const workspaceLinkedAssignmentIds = {};


    workspaces.forEach(workspace => {
      // console.log(workspace);
      if (
        workspace._internalModel &&
        workspace._internalModel.__relationships &&
        workspace._internalModel.__relationships.initializedRelationships &&
        workspace._internalModel.__relationships.initializedRelationships
          .linkedAssignment &&
        workspace._internalModel.__relationships.initializedRelationships
          .linkedAssignment.canonicalState &&
        workspace._internalModel.__relationships.initializedRelationships
          .linkedAssignment.canonicalState.id
      ) {
        workspaceLinkedAssignmentIds[workspace.id] =
          workspace._internalModel.__relationships.initializedRelationships.linkedAssignment.canonicalState.id;
      }

    });



    this.myLinkedAssignments = workspaceLinkedAssignmentIds;
  }

});
