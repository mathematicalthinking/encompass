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
          responses: this.get('store').peekAll('response'),
        })
        .then((hash) => {
          return {
            response: hash.response,
            submission: hash.submission,
            workspace: hash.workspace,
            responses: hash.responses,
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
    },
    toResponses() {
      this.transitionTo('responses');
    }
  }
});
