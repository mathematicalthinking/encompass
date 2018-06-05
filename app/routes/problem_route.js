Encompass.ProblemRoute = Ember.Route.extend({
  model: function () {
		var store = this.get('store');
    var problems = store.findAll('problem');
    // Filter only problems by current logged in user
    return problems;
  },

  renderTemplate: function () {
		this.render('problem');
	}
});
