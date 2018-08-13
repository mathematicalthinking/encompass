Encompass.SectionRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var section = this.get('store').findRecord('section', params.id);
    return section;
  },

  renderTemplate: function () {
    this.render('sections/section');
  },

  actions: {
    toSectionList: function () {
      this.transitionTo('sections');
      console.log('running to sectionList');
    },
  }
});
