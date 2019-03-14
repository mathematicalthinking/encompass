/*global _:false */
/** # Workspace Route
  * @description base route for the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
Encompass.WorkspaceRoute = Ember.Route.extend({
  needs: 'application',
  // using regular ajax request because sideloaded  data was not being pushed in to store soon enough
  // when using ember data
  model: function(params) {
    let url = `/api/workspaces/${params.workspace_id}`;

    return Ember.$.get({url})
    .then((results) => {
      _.each(results, (val, key) => {
        if (val) {
          this.get('store').pushPayload({
            [key]: val
          });
        }
      });
      return this.get('store').peekRecord('workspace', params.workspace_id);
    });
  },

  actions: {
    tour: function(){
      //this could be factored out to a mixin if we have other tours
      var user = this.modelFor('application');
      user.set('seenTour', null);
      this.send('startTour', 'workspace');
    },
  }
});
