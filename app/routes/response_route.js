Encompass.ResponseRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {

  model: function(params) {
    return this.get('store').findRecord('response', params.response_id)
      .then((response) => {
        return Ember.RSVP.hash({
          submission: response.get('submission'),
          workspace: response.get('workspace'),
          comments: response.get('comments'),
          selections: response.get('selections'),
          response,
        })
        .then((hash) => {
          return {
            response: hash.response,
            submission: hash.submission,
            workspace: hash.workspace
          };
        });
      });
  },

  renderTemplate: function () {
    this.render('responses/response');
  },
  actions: {
    toResponseInfo(response) {
      this.transitionTo('response', response.get('id'));
    }
  }
});
