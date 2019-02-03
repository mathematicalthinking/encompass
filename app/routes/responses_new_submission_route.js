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

    let isDraft = false;
    let draftId = null;

    let responsesModel = this.modelFor('responses');
    let user = this.modelFor('application');

    return this.get('store').findRecord('submission', params.submission_id)
      .then((sub) => {
        submission = sub;
        return this.resolveWorkspace(this.get('workspace'), submission);
      })
      .then((workspace) => {
        let associatedResponses = responsesModel.responses.filter((response) => {
          let creatorId = response.belongsTo('createdBy').id();
          let status = response.get('status');
          let subId = response.belongsTo('submission').id();

          if (status === 'draft' && subId === submission.get('id') && creatorId === user.get('id')) {
            isDraft = true;
            draftId = response.get('id');
          }
          return subId === submission.get('id');
        });

        if (isDraft) {
          return Ember.RSVP.hash({
            isDraft: true,
            submissionId: submission.get('id'),
            responseId: draftId,
          });
        }

        return Ember.RSVP.hash({
          submission,
          workspace,
          submissions: workspace.get('submissions'),
          recipient: this.resolveRecipient(submission, workspace),
          selections: submission.get('selections'),
          comments: submission.get('comments'),
          responses: associatedResponses,
          notifications: user.get('notifications'),
        });
      })
      .then((hash) => {
        if (hash.isDraft) {
          return hash;
        }
        let studentSubmissions = hash.submissions.filterBy('student', hash.submission.get('student'));

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
          workspace: hash.workspace,
          responses: hash.responses,
          submissions: studentSubmissions,
          notifications: hash.notifications,
        };
      });

  },

  afterModel(model, transition) {
    if (model.isDraft) {
      this.transitionTo('responses.submission', model.submissionId, {queryParams: {responseId: model.responseId} });    }
  },
  actions: {
    toResponse(submissionId, responseId) {
      this.transitionTo('responses.submission', submissionId, {queryParams: {responseId: responseId} });
    },
    toResponseSubmission(subId) {
      this.transitionTo('responses.submission', subId);
    },
  }

});
