/**
  * # Application Route
  * @description This is the main application route. Here we expose application wide:
                 + Models &
                 + Actions
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  * @todo Manage the current user without setting on the Encompass object itself.
  */
Encompass.ApplicationRoute = Ember.Route.extend({ //the application route can't require authentication since it's getting the user
  model: function() {
    var store = this.get('store');
    var currentUser = new Ember.RSVP.Promise(function(resolve, reject) {
      store.query('user', {alias: 'current'}).then( function (result) {
        var user = result.get('firstObject');
        if(result.get('length') > 1) {
          console.error('something is wrong: current user request is returning multiple items');
        }
        resolve(user);
      }, function currentUserError(err){
        reject(err);
        window.alert('You are no longer logged in, redirecting you');
        window.location.href = 'auth';
      });
    });
    return currentUser;
  },

  afterModel: function(user, transition) {
    //not crazy that this is duplicated here and in AuthenticatedRoute...
    if(!user.get('isAuthenticated')) {
      this.transitionTo('auth');
    } else if(!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  },

  actions: {
    // TODO: Remove all the modal stuff
    openModal: function(modalName, model) {
      console.log("Application opening modal: " + modalName );
      if(model) {
        this.controllerFor(modalName).set('model', model);
      }
      return this.render(modalName, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closeModal: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },

    openPanel: function(panelName, model) {
      if(model) {
        this.controllerFor(panelName).set('model', model);
      }
      return this.render(panelName, {
        into: 'application',
        outlet: 'modal'
      });
    },

    closePanel: function() {
      return this.disconnectOutlet({
        outlet: 'modal',
        parentView: 'application'
      });
    },

    doneTour: function() {
      var user = this.get('model');
      user.set('seenTour', new Date());
      user.save();
      guiders.hideAll();
    },

    reloadPage: function() {
      window.location.reload();
    }

  }
});
