Encompass.DashboardRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    let user = this.get("store").queryRecord("user", { alias: "current" });
    let assignments = this.get("store").findAll("assignment");
    return {assignments, user};
  },

  renderTemplate: function () {
    this.render("dashboard/index");
  },
});
