import AuthenticatedRoute from './_authenticated_route';
/**
 * # Answers Route
 * @description Route for dealing with all answer objects
 * @todo This is really the answers_index route and should be named as such by convention
 */
export default AuthenticatedRoute.extend({
  model: function () {
    let answers = this.store.findAll('answer');
    return answers;
  },

  renderTemplate: function () {
    this.render('answers/answers');
  },
});
