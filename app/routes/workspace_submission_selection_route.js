Encompass.WorkspaceSubmissionSelectionRoute = Ember.Route.extend({

  afterModel: function(model, transition) {
    this.controllerFor('workspace').set('currentSelection', model);
  },

  deactivate: function() {
    this.controllerFor('workspace').set('currentSelection', null);
  },

  doTour: function() {
    console.log('doing tour');
    var user = this.modelFor('application');

    Ember.run.schedule('afterRender', function() {
      if(!user.get('seenTour')) { //customize for this part of the tour
        guiders.hideAll();
        console.log('ignoring tour');
        //guiders.show('comments');
      }
    });
  }.observes('shouldDoTour'),

  shouldDoTour: function() {
    var user = this.modelFor('application');
    var userSeenTour = user.get('seenTour');
    var redoTour = this.get('Encompass.redoTour');
    return userSeenTour || redoTour;
  }.property('Encompass.redoTour'),

  renderTemplate: function() {
    this.render();
    $('#commentTextarea').focus();
    // var user = this.modelFor('application');
//    if (!user.get('seenTour')) {
//      this.doTour();
//    }
  },

});
