/**
  * # Home Page Route
  * @description This is a base route for the Home Page / dashboard, This model hook returns all assignments, Assignments is being passed to be displyed in a table in the child dashboard-assignments-list component.
  * @author Crispina Muriel
  * @since 2.3.0
  */
Encompass.HomePageRoute = Encompass.AuthenticatedRoute.extend({
  model: function () {
    let assignments = this.get("store").findAll("assignment");
    return assignments;
  }
});
