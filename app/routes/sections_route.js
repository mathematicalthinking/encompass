Encompass.SectionsRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var store = this.get('store');
    var sections = store.findAll('sections');
    // Filter only problems by current logged in user
    return sections;
  }
});
