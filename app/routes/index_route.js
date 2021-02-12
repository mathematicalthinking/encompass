/**
  */
Encompass.IndexRoute = Ember.Route.extend({
  model: function () {
    let user = this.modelFor('application');
    let assignments = this.get("store").findAll("assignment");
    return { "assignments": assignments, "user": user};
  },
  renderTemplate: function () {
    this.render("index");
  },
});
