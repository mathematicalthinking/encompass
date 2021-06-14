Encompass.SectionsRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    return this.get('store').findAll('section');
  },
});
