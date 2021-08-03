import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash, resolve } from 'rsvp';
import ConfirmLeavingRoute from '../_confirm_leaving_route';

export default Route.extend(ConfirmLeavingRoute, {
  utils: service('utility-methods'),

  renderTemplate: function (controller, model) {
    this.render('responses/response');
  },

  beforeModel(transition) {
    let workspaceId = transition.queryParams.workspaceId;

    if (this.utils.isValidMongoId(workspaceId)) {
      this.set('workspace', this.store.peekRecord('workspace', workspaceId));
    }
  },
  resolveWorkspace(workspace, submission) {
    if (workspace) {
      return resolve(workspace);
    }
    let wsIds = submission.hasMany('workspaces').ids();
    let wsId = wsIds.get('firstObject');
    return this.store.findRecord('workspace', wsId);

    // in current structure do submissions ever have multiple workspaces?
  },
  resolveRecipient(submission, workspace) {
    // if creator of submission is enc user, they should always be in store
    // since to get here you have to click respond from that user's submission
    let encUserId = submission.get('creator.studentId');
    if (this.utils.isValidMongoId(encUserId)) {
      return this.store.findRecord('user', encUserId);
    }
    // if creator of submission is not enc user (i.e. old PoWs user)
    // set recipient as either the first feedbackAuthorizer or the owner of workspace
    let firstApproverId = workspace.get('feedbackAuthorizers.firstObject');

    if (this.utils.isValidMongoId(firstApproverId)) {
      return this.store.findRecord('user', firstApproverId);
    }
    return workspace.get('owner');
  },

  model: function (params) {
    let submission;

    let isDraft = false;
    let draftId = null;

    let allResponses = this.store.peekAll('response');
    let user = this.modelFor('application');

    return this.store
      .findRecord('submission', params.submission_id)
      .then((sub) => {
        submission = sub;
        return this.resolveWorkspace(this.workspace, submission);
      })
      .then((workspace) => {
        let associatedResponses = allResponses.filter((response) => {
          let creatorId = response.belongsTo('createdBy').id();
          let status = response.get('status');
          let subId = response.belongsTo('submission').id();

          if (
            status === 'draft' &&
            subId === submission.get('id') &&
            creatorId === user.get('id')
          ) {
            isDraft = true;
            draftId = response.get('id');
          }
          return subId === submission.get('id');
        });

        if (isDraft) {
          return hash({
            isDraft: true,
            submissionId: submission.get('id'),
            responseId: draftId,
          });
        }

        return hash({
          submission,
          workspace,
          submissions: workspace.get('submissions'),
          recipient: this.resolveRecipient(submission, workspace),
          selections: submission.get('selections'),
          comments: submission.get('comments'),
          responses: associatedResponses,
        });
      })
      .then((hash) => {
        if (hash.isDraft) {
          return hash;
        }
        let studentSubmissions = hash.submissions.filterBy(
          'student',
          hash.submission.get('student')
        );

        let response = this.store.createRecord('response', {
          submission: hash.submission,
          workspace: hash.workspace,
          recipient: hash.recipient,
          responseType: 'mentor',
          source: 'submission',
        });

        response.get('selections').addObjects(hash.selections);
        response.get('comments').addObjects(hash.comments);
        return {
          response,
          submission: hash.submission,
          workspace: hash.workspace,
          responses: hash.responses,
          submissions: studentSubmissions,
        };
      });
  },

  afterModel(model, transition) {
    if (model.isDraft) {
      this.transitionTo('responses.submission', model.submissionId, {
        queryParams: { responseId: model.responseId },
      });
    }
  },
  actions: {
    toResponse(submissionId, responseId) {
      this.transitionTo('responses.submission', submissionId, {
        queryParams: { responseId: responseId },
      });
    },
    toResponseSubmission(subId) {
      this.transitionTo('responses.submission', subId);
    },
  },
});
