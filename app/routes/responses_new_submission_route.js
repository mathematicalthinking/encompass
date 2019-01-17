Encompass.ResponsesNewSubmissionRoute = Ember.Route.extend(Encompass.ConfirmLeavingRoute, {
  utils: Ember.inject.service('utility-methods'),

  renderTemplate: function(controller, model) {
    this.render('responses/response');

  },

  beforeModel(transition) {
    let workspaceId = transition.queryParams.workspaceId;

    if (this.get('utils').isValidMongoId(workspaceId)) {
      this.set('workspace', this.get('store').peekRecord('workspace', workspaceId));
    }

  },
  resolveWorkspace(workspace, submission) {
    if (workspace) {
      return Ember.RSVP.resolve(workspace);
    }
    // in current structure do submissions ever have multiple workspaces?
    return submission.get('workspaces')
    .then((workspaces) => {
      return workspaces.get('firstObject');
    });
  },
  resolveRecipient(submission, workspace) {
    // if creator of submission is enc user, they should always be in store
    // since to get here you have to click respond from that user's submission
    let encUserId = submission.get('creator.studentId');
    if (this.get('utils').isValidMongoId(encUserId)) {
      return this.get('store').findRecord('user', encUserId);
    }
    // if creator of submission is not enc user (i.e. old PoWs user)
    // set recipient as either the first feedbackAuthorizer or the owner of workspace
    let firstApproverId = workspace.get('feedbackAuthorizers.firstObject');

    if (this.get('utils').isValidMongoId(firstApproverId)) {
      return this.get('store').findRecord('user', firstApproverId);
    }
    return workspace.get('owner');

  },

  model: function(params){
    let submission;

    return this.get('store').findRecord('submission', params.submission_id)
      .then((sub) => {
        submission = sub;
        return this.resolveWorkspace(this.get('workspace'), submission);
      })
      .then((workspace) => {
        return Ember.RSVP.hash({
          submission,
          workspace,
          recipient: this.resolveRecipient(submission, workspace),
          selections: submission.get('selections'),
          comments: submission.get('comments')
        });
      })
      .then((hash) => {
        let response = this.get('store').createRecord('response', {
          submission: hash.submission,
          workspace: hash.workspace,
          recipient: hash.recipient,
          responseType: 'mentor',
          source: 'submission'
        });

        response.get('selections').addObjects(hash.selections);
        response.get('comments').addObjects(hash.comments);
        return {
          response,
          submission: hash.submission,
          workspace: hash.workspace
        };
      });

  },
  actions: {
    toResponse(responseId) {
      this.transitionTo('response', responseId);
    }
  }

});
