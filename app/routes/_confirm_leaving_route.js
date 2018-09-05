/*
 # ConfirmEditingRoute - A Route Mixin

 This mixin will confirm navigation away from a controller where .get('confirmLeaving') is true
 It supports both transitioning away and leaving the page altogether
 It cleans up it's window event binding
 It also currently marks 'editing' false on the controller (room for improvement)
*/
Encompass.ConfirmLeavingRoute = Ember.Mixin.create({

  confirmText: 'You have unsaved changes which you may lose.  Are you sure you want to leave?',

  activate: function() {
    var route = this;
    $(window).on('beforeunload.' + route.get('controllerName') + '.confirm', function() {
      if(route.controller.get('confirmLeaving')) {
        return route.get('confirmText');
      }
    });
  },

  deactivate: function() {
    var route = this;
    $(window).off('beforeunload.' + route.get('controllerName') + '.confirm');
  },

  actions: {
    willTransition: function(transition) {
      var controller = this.get('controller');
      if (controller.get('confirmLeaving') &&
          !window.confirm(this.get('confirmText'))) {
        transition.abort();
        if (window.history) {
          window.history.forward();
        }
      } else {
        // Bubble the `willTransition` action so that
        // parent routes can decide whether or not to abort.
        controller.set('editing', false); //always set editing to false, that way
          //1: arbitrary nested response routes don't trigger the confirm
          //2: reinforce that people are leaving the editing mode
        return true;
      }
    }
  }

});
