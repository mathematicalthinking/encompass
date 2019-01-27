Encompass.ResponseRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {
  utils: Ember.inject.service('utility-methods'),

  model: function(params) {
    return this.get('store').findRecord('response', params.response_id);
  },

  redirect(model, transition ) {
    if (!model) {
      this.transitionTo('responses');
    } else {
      let submissionId = this.get('utils').getBelongsToId(model, 'submission');
      if (this.get('utils').isValidMongoId(submissionId)) {
        this.transitionTo('responses.submission', submissionId, {queryParams: {responseId: model.get('id')} });
      } else {
        this.transitionTo('responses');
      }
    }

  },

  actions: {
    toResponseInfo(response) {
      this.transitionTo('response', response.get('id'));
    },
    toResponses() {
      this.transitionTo('responses');
    },
    toNewResponse: function(submissionId, workspaceId) {
      this.transitionTo('responses.new.submission', submissionId, {queryParams: {workspaceId: workspaceId}});
    }
  }
});
