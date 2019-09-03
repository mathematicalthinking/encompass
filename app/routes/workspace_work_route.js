/** # Workspace Work Route
  * @description The workspace work route, really just a redirect to the first submission of the workspace
  * @author Amir Tahvildaran, Daniel Kelly
  * @since 1.0.1
  */
Encompass.WorkspaceWorkRoute = Ember.Route.extend({
  alert: Ember.inject.service('sweet-alert'),

  afterModel: function(model, transition) {
    let hasSubmissions = model.get('submissions.length') > 0;

    if (hasSubmissions) {
      this.transitionTo('workspace.submissions.first');
    } else {
      // no work in workspace yet, redirect to info page
      this.get('alert').showToast('info', 'Workspace does not have any submissions yet', 'bottom-end', 3000, false, null);

      this.transitionTo('workspace.info');
    }
  },

});
