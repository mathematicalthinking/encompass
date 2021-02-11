/**
  */
Encompass.IndexRoute = Ember.Route.extend({
  model: function () {
    let assignments = this.get("store").findAll("assignment");
    return assignments;
  },
  renderTemplate: function () {
    this.render("index");
  },
});
