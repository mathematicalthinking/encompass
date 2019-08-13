Encompass.AuthSignupRoute = Encompass.LoggedOutRoute.extend({
  beforeModel() {
    this._super(...arguments);
  },

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
