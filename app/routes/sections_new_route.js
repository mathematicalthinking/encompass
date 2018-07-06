Encompass.SectionsNewRoute = Encompass.AuthenticatedRoute.extend({
    model: function (params) {
      var user = this.modelFor('application');
      return user;
    },
    renderTemplate: function () {
      this.render('sections/new');
    }
  });