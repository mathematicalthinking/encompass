Encompass.SectionRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    console.log('params.id section info', params);
    var section = this.get('store').findRecord('section', params.sectionId);
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
    toAssignmentInfo: function (assignment) {
      this.transitionTo('assignment', assignment);
    }
  }
});
