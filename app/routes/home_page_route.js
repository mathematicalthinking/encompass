/**
  * # Home Page Route
  * @description This is a base route for the dashboard, This model hook is returning all assignments, Assignments is being passed to be displyed in child dashboard table component.
  * @author Crispina Muriel
  * @since 2.3.0
  */
Encompass.HomePageRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    let assignments = this.get("store").findAll("assignment");
    return assignments;
  }
});
