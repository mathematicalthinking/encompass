import AuthenticatedRoute from './_authenticated_route';

export default AuthenticatedRoute.extend({
  model: function (params) {
    const answer = this.store.findRecord('answer', params.id);
    return answer;
  },

  renderTemplate: function () {
    this.render('answers/answer');
  },
});
