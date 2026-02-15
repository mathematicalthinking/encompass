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

  async resolveWorkspace(workspace, submission) {
    if (workspace) {
      return workspace;
    }
    const wsIds = submission.hasMany('workspaces').ids();
    const wsId = wsIds[0];

    if (!this.utils.isValidMongoId(wsId)) {
      return null;
    }
    return this.store.findRecord('workspace', wsId);
  }

  async resolveRecipient(submission, workspace) {
    const creator = await submission.creator;
    const encUserId = this.utils.getBelongsToId(creator, 'studentId');

    if (this.utils.isValidMongoId(encUserId)) {
      return this.store.findRecord('user', encUserId);
    }

    const feedbackAuthorizers = await workspace.feedbackAuthorizers;
    const firstApproverId = feedbackAuthorizers?.[0]?.id;
    if (this.utils.isValidMongoId(firstApproverId)) {
      return this.store.findRecord('user', firstApproverId);
    }

    return workspace.owner;
  }

  _findDraftResponse(responses, submissionId, userId) {
    return responses.find((response) => {
      const creatorId = this.utils.getBelongsToId(response, 'createdBy');
      const status = response.status;
      const subId = this.utils.getBelongsToId(response, 'submission');

      return (
        status === 'draft' &&
        subId === submissionId &&
        creatorId === userId &&
        !response.isTrashed
      );
    });
  }

  _filterResponsesBySubmission(responses, submissionId) {
    return responses.filter(
      (response) =>
        this.utils.getBelongsToId(response, 'submission') === submissionId
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
      // Don't assign submission here - it triggers the hasMany assertion
      workspace,
      recipient,
      responseType: 'mentor',
      source: 'submission',
    });

    response.selections.addObjects(selections);
    response.comments.addObjects(comments);

    return response;
  }

  async model(params) {
    const allResponses = this.store.peekAll('response');
    const user = this.currentUser.user;

    const submission = await this.store.findRecord(
      'submission',
      params.submission_id,
      { reload: true }
    );

    // Load answer relationship for VMT submissions (needed for AI draft)
    try {
      await submission.answer;
    } catch (e) {
      // Answer might not exist for non-VMT submissions, that's okay
    }

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
    const [recipient, selections, comments] = await Promise.all([
      this.resolveRecipient(submission, workspace),
      submission.selections,
      submission.comments,
    ]);

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
      // Only pass the single target submission, not entire revision thread
      // This ensures "Draft From AI" and "Respond" work on the correct revision
      submissions: [submission],
    };
  }

  afterModel(model) {
    if (model?.isDraft) {
      this.replaceWith('responses.submission', model.submissionId, {
        queryParams: { responseId: model.responseId },
      });
    }
  }
}
