Encompass.SectionRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var section = this.modelFor('section').filterBy('id', params.id).get('firstObject');
    return section;
  },

  renderTemplate: function () {
    this.render('sections/section');
  }
});
