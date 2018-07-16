Encompass.CurrentUserService = Ember.Service.extend({

  init: function () {
    console.log('current user service running');
  },

  // model: function () {
  //   var store = this.get('store');
  //   var currentUser = new Ember.RSVP.Promise(function (resolve, reject) {
  //     store.query('user', {
  //       alias: 'current'
  //     }).then(function (result) {
  //       var user = result.get('firstObject');
  //       if (result.get('length') > 1) {
  //         console.error('something is wrong: current user request is returning multiple items');
  //       }
  //       resolve(user);
  //     }, function currentUserError(err) {
  //       reject(err);
  //       window.alert('You are no longer logged in, redirecting you');
  //       window.location.href = '/';
  //     });
  //   });
  //   return currentUser;
  // },
});
