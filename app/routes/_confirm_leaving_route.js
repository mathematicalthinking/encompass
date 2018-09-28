/*
 # ConfirmEditingRoute - A Route Mixin

 This mixin will confirm navigation away from a controller where .get('confirmLeaving') is true
 It supports both transitioning away and leaving the page altogether
 It cleans up it's window event binding
 It also currently marks 'editing' false on the controller (room for improvement)
*/
Encompass.ConfirmLeavingRoute = Ember.Mixin.create({

  confirmText: 'You have unsaved changes which you may lose.  Are you sure you want to leave?',

  activate: function () {
    var route = this;
    $(window).on('beforeunload.' + route.get('controllerName') + '.confirm', function () {
      if (route.controller.get('confirmLeaving')) {
        return route.get('confirmText');
      }
    });
  },

  // activate: function() {
  //   var route = this;
  //   $(window).on('beforeunload', function() {
  //     console.log('before rcgcl');
  //     if(route.controller.get('confirmLeaving')) {
  //       console.log('hey');
  //       // return route.get('confirmText');
  //     }
  //   });
  // },

  deactivate: function() {
    var route = this;
    console.log('confirm route deactivate function');
    $(window).off('beforeunload.' + route.get('controllerName') + '.confirm');
  },

  actions: {
    doConfirmLeaving: function (value) {
      console.log('do confirm leaving: ', value);
      this.sendAction('doConfirmLeaving', value);
    },

    willTransition: function(transition) {
      var controller = this.get('controller');
      console.log('transition', transition);
      if (controller.get('confirmLeaving')) {
        transition.abort();
        window.swal({
          title: 'Are you sure you want to leave',
          type: 'question',
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'Yes',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          console.log('result is', result);
          if (result.value) {
            controller.set('editing', false);
            controller.set('confirmLeaving', false);
            transition.retry();
            console.log('result value exists');
          } else if (result.dismiss === "cancel") {
            console.log('result is cancel');
            if (window.history) {
              console.log('inside window history');
              window.history.forward();
            }
          }
        });
      }

      // if (controller.get('confirmLeaving') && !window.confirm(this.get('confirmText'))) {
      //   if (window.history) {
      //     window.history.forward();
      //   }
      //   transition.abort();

      // } else {
      //   // Bubble the `willTransition` action so that
      //   // parent routes can decide whether or not to abort.
      //   controller.set('editing', false); //always set editing to false, that way
      //     //1: arbitrary nested response routes don't trigger the confirm
      //     //2: reinforce that people are leaving the editing mode
      //   return true;
      // }
    }
  }

});
