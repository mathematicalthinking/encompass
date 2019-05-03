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
  userNtfs: Ember.inject.service('user-ntfs'),

  beforeModel: function() {
    let that = this;
    console.log('that', that);
    window.addEventListener('touchstart', function onFirstTouch() {
      console.log('touch detected');
      // that.sendAction('handleFirstTouch');
      that.controller.set('isTouchScreen', true);
      window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);
  },

  model: function() {
    return this.get('store').queryRecord('user', {alias: 'current'});
    },

  afterModel: function(user, transition) {
    //not crazy that this is duplicated here and in AuthenticatedRoute...

    // Need this check so that the user isn't auto-redirected to home after
    // clicking on reset password link

    if (user.get('isAuthenticated')) {
      this.get('userNtfs').setupProperties(user);
    }
    const allowedPaths = ['auth.reset', 'auth.confirm', 'auth.forgot', 'auth.login', 'auth.signup'];
    const targetPath = transition.targetName;

    if (allowedPaths.includes(targetPath)) {
      return;
    }
    //Do we need this check for isAuthenticated here? All routes that should be authenticated
    // should be extending AuthenticatedRoute.
    if(!user.get('isAuthenticated')) {
      this.transitionTo('auth.login');
    }else if (!user.get('isEmailConfirmed') && !user.get('isStudent')) {
      this.transitionTo('unconfirmed');
    }else if(!user.get('isAuthz')) {
      this.transitionTo('unauthorized');
    }
  },

  actions: {
    // TODO: Remove all the modal stuff
    openModal: function(modalName, model) {
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
