/** # Workspace Work Route
  * @description The workspace work route, really just a redirect to the first submission of the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspaceWorkRoute = Ember.Route.extend({

  afterModel: function(model, transition) {
    this.transitionTo('workspace.submissions.first');
  },

});
