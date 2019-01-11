Encompass.ResponsesNewSubmissionRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {

  renderTemplate: function(controller, model) {
    // controller.set('model', model);
    // controller.set('editing', false);
    this.render('responses/response');

  },

  beforeModel(transition) {
    let workspaceId = transition.queryParams.workspaceId;

    if (workspaceId) {
      let workspace = this.get('store').peekRecord('workspace', workspaceId);
      if (workspace) {
        this.set('workspace', workspace);
      }
    }

  },

  model: function(params){
    return this.get('store').findRecord('submission', params.submission_id)
    .then((submission) => {
      return Ember.RSVP.hash({
        submission,
        workspace: this.get('workspace'),
        selections: submission.get('selections'),
        comments: submission.get('comments')
      });
    })
    .then((hash) => {
      let response = this.get('store').createRecord('response', {
        submission: hash.submission,
        workspace: hash.workspace,
        source: 'submission'
      });
      response.get('selections').addObjects(hash.selections);
      response.get('comments').addObjects(hash.comments);
      return response;
    });

  },

});
