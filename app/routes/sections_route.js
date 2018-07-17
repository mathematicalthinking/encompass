Encompass.SectionsRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    let sections = this.get('store').findAll('section');
    return sections;
  }
});
