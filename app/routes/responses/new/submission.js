import { service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ResponsesNewSubmissionRoute extends Route {
  @service('utility-methods') utils;
  @service store;
  @service router;
  @service currentUser;

  beforeModel(transition) {
    const workspaceId = transition.intent?.queryParams?.workspaceId;
    if (this.utils.isValidMongoId(workspaceId)) {
      this.workspace = this.store.peekRecord('workspace', workspaceId);
    }
  }

  resolveWorkspace(workspace, submission) {
    if (workspace) {
      return Promise.resolve(workspace);
    }
    const wsIds = submission.hasMany('workspaces').ids();
    const wsId = wsIds[0];

    if (!this.utils.isValidMongoId(wsId)) {
      return Promise.resolve(null);
    }
    return this.store.findRecord('workspace', wsId);
  }

  async resolveRecipient(submission, workspace) {
    const encUserId = submission.get('creator.studentId');

    if (this.utils.isValidMongoId(encUserId)) {
      return this.store.findRecord('user', encUserId);
    }

    const firstApproverId = workspace.get('feedbackAuthorizers')[0];
    if (this.utils.isValidMongoId(firstApproverId)) {
      return this.store.findRecord('user', firstApproverId);
    }

    return await workspace.get('owner');
  }

  _findDraftResponse(responses, submissionId, userId) {
    return responses.find((response) => {
      const creatorId = this.utils.getBelongsToId(response, 'createdBy');
      const status = response.get('status');
      const subId = this.utils.getBelongsToId(response, 'submission');

      return (
        status === 'draft' && subId === submissionId && creatorId === userId
      );
    });
  }

  _filterResponsesBySubmission(responses, submissionId) {
    return responses.filter(
      (response) => response.belongsTo('submission').id() === submissionId
    );
  }

  _createResponseRecord(
    submission,
    workspace,
    recipient,
    selections,
    comments
  ) {
    const response = this.store.createRecord('response', {
      submission,
      workspace,
      recipient,
      responseType: 'mentor',
      source: 'submission',
    });

    response.get('selections').addObjects(selections);
    response.get('comments').addObjects(comments);

    return response;
  }

  async model(params) {
    const allResponses = this.store.peekAll('response');
    const user = this.currentUser.user;

    const submission = await this.store.findRecord(
      'submission',
      params.submission_id
    );

    // Early return if draft exists
    const draftResponse = this._findDraftResponse(
      allResponses,
      submission.id,
      user.id
    );

    if (draftResponse) {
      return {
        isDraft: true,
        submissionId: submission.id,
        responseId: draftResponse.id,
      };
    }

    // what if workspace is null?
    const workspace = await this.resolveWorkspace(this.workspace, submission);

    if (!workspace) {
      this.router.transitionTo('error');
      return;
    }

    // Load all async data in parallel
    const [submissions, recipient, selections, comments] = await Promise.all([
      workspace.get('submissions'),
      this.resolveRecipient(submission, workspace),
      submission.get('selections'),
      submission.get('comments'),
    ]);

    // should we check the student ids rather than the objects?
    const studentSubmissions = submissions.filter(
      (sub) => sub.uniqueIdentifier === submission.uniqueIdentifier
    );

    const associatedResponses = this._filterResponsesBySubmission(
      allResponses,
      submission.id
    );

    const response = this._createResponseRecord(
      submission,
      workspace,
      recipient,
      selections,
      comments
    );

    return {
      response,
      submission,
      workspace,
      responses: associatedResponses,
      submissions: studentSubmissions,
    };
  }

  afterModel(model) {
    if (model.isDraft) {
      this.router.transitionTo('responses.submission', model.submissionId, {
        queryParams: { responseId: model.responseId },
      });
    }
  }
}
