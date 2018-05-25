/** # Workspace Route
  * @description base route for the workspace
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  */
Encompass.WorkspaceRoute = Ember.Route.extend({
  needs: 'application',

  actions: {
    tour: function(){
      //this could be factored out to a mixin if we have other tours
      var user = this.modelFor('application');
      user.set('seenTour', null);
      this.send('startTour', 'workspace');
    },
    //error: function(error, transition) {
    //  console.log("Error in workspace route: " + JSON.stringify(error) );
      //console.trace();

      /*
      if(error.status === 403) {
        window.alert("Looks like you don't have permission for that workspace");
        this.transitionTo('workspaces');
      }
      */
    //},
    //tagSelection: function(selection, tags){
    //}

  }
});
