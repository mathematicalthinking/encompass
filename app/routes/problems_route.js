Encompass.ProblemsRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    return Ember.RSVP.hash({
      // problems: this.get('store').findAll('problem'),
      publicProblems: this.get('store').findAll('problem').filterBy('isPublic', true),
      currentUser: this.modelFor('application'),
    });
    // var store = this.get('store');
    // var problems = store.findAll('problem');
    // // Filter only problems by current logged in user
    // return problems;
  }
});
