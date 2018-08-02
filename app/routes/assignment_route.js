Encompass.AssignmentRoute = Encompass.AuthenticatedRoute.extend({
  model: function (params) {
    var assignment = this.get('store').findRecord('assignment', params.id);
    return assignment;
  },

  renderTemplate: function () {
    this.render('assignments/assignment');
  }
});
