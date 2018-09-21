Encompass.AuthSignupRoute = Ember.Route.extend({
  model: function() {
    return this.store.query('organization', {
      sortBy: 'members'
    }).then((orgs) => {
      return orgs;
    });
  },

  actions: {
    toHome: function () {
      window.location.href = '/';
    }
  }
});
