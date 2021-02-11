/**
 * # Home Page Assignments Route
 * @description Route for dealing with all assignment objects
 */
Encompass.HomePageRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    let assignments = this.get("store").findAll("assignment");
    return assignments;
  }
});
