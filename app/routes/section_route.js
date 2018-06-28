Encompass.SectionRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var problem = this.modelFor('section').filterBy('id', params.id).get('firstObject');
    return problem;
  },

  renderTemplate: function () {
    this.render('sections/section');
  }
});
