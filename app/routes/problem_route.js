Encompass.ProblemRoute = Ember.Route.extend({
  model: function () {
		var store = this.get('store');
    var problems = store.findAll('problem');
    console.log('problems model route called!!');
    console.log(problems);
    return problems;
  },

  renderTemplate: function () {
		this.render('problem');
	}
});
