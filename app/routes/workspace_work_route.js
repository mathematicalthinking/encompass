/** # Workspace Work Route
  * @description The workspace work route, really just a redirect to the first submission of the workspace
  * @author Amir Tahvildaran, Daniel Kelly
  * @since 1.0.1
  */
Encompass.WorkspaceWorkRoute = Ember.Route.extend({

  afterModel: function(model, transition) {
    let hasSubmissions = model.get('submissions.length') > 0;

    if (hasSubmissions) {
      this.transitionTo('workspace.submissions.first');
    } else {
      // no work in workspace yet, redirect to info page
      this.transitionTo('workspace.info');
    }
  },

});
