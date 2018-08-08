Encompass.WorkspaceInfoRoute = Ember.Route.extend({
  model: function (params) {
    var workspace = this.get('store').findRecord('workspace', params.id);
    return workspace;
  },

  renderTemplate: function () {
    this.render('workspace/info');
  },

});