import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';

export default class ResponsesRoute extends AuthenticatedRoute {
  @service('utility-methods') utils;
  @service store;
  @service router;
  @service currentUser;
  queryParams = {
    responseId: {
      refreshModel: true,
    },
  };

  beforeModel(transition) {
    let responseId;
    if (transition.intent.queryParams) {
      responseId = transition.intent.queryParams.responseId;
    }
    let allResponses = this.store.peekAll('response');

    if (this.utils.isValidMongoId(responseId)) {
      let response = allResponses.findBy('id', responseId);

      this.response = response;
    } else {
      this.response = null;
    }
  }

  resolveSubmission(submissionId) {
    let peeked = this.store.peekRecord('submission', submissionId);
    if (peeked) {
      return Promise.resolve(peeked);
    }
    return this.store.findRecord('submission', submissionId);
  }

  resolveWorkspace(workspaceId) {
    let peeked = this.store.peekRecord('workspace', workspaceId);
    if (peeked) {
      return Promise.resolve(peeked);
    }
    return this.store.findRecord('workspace', workspaceId);
  }
  async model(params) {
    if (!params.submission_id) {
      return null;
    }

    let submission = await this.resolveSubmission(params.submission_id);
    let wsIds = submission.hasMany('workspaces').ids();
    let wsId = wsIds.get('firstObject');
    let workspace = await this.resolveWorkspace(wsId);

    let [studentSubmissions, associatedResponses] = await Promise.all([
      workspace.get('submissions'),
      workspace.get('responses'),
    ]);

    const submissionThread = studentSubmissions.filterBy(
      'student',
      submission.get('student')
    );
    const latestSubmission = submissionThread
      .slice()
      .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
      .at(0);
    const activeSubmission = latestSubmission || submission;

    let allResponses = this.store.peekAll('response');
    let additionalDrafts = allResponses.filter((response) => {
      const workspaceId = this.utils.getBelongsToId(response, 'workspace');
      const submissionId = this.utils.getBelongsToId(response, 'submission');
      const createdById = this.utils.getBelongsToId(response, 'createdBy');
      const currentUserId = this.currentUser?.user?.id;

      return (
        workspaceId === workspace.id &&
        submissionId === activeSubmission.id &&
        response.status === 'draft' &&
        createdById === currentUserId &&
        !response.isTrashed &&
        !associatedResponses.find((r) => r.id === response.id)
      );
    });

    let combinedResponses = [
      ...associatedResponses.toArray().filter((r) => !r.isTrashed),
      ...additionalDrafts,
    ];

    let response = null;
    if (params.responseId) {
      try {
        response = await this.store.findRecord('response', params.responseId);

        // If response is trashed, clear it and the query param
        if (response?.isTrashed) {
          response = null;
          this.router.replaceWith(
            'responses.submission',
            params.submission_id,
            {
              queryParams: { responseId: null },
            }
          );
          return;
        }
      } catch (e) {
        console.error('Failed to load response:', e);
        // Response doesn't exist (404), clear the query param
        this.router.replaceWith('responses.submission', params.submission_id, {
          queryParams: { responseId: null },
        });
        return;
      }
    }
    if (!response && this.response) {
      response = this.response;
    }

    if (!response) {
      response = combinedResponses
        .filter((r) => r.responseType === 'mentor' && !r.isTrashed)
        .sortBy('createDate')
        .get('lastObject');
    }

    const model = {
      submission: activeSubmission,
      workspace,
      submissions: submissionThread,
      responses: combinedResponses,
      response: response || null,
      allResponses,
    };
    return model;
  }

  // async model(params) {
  //   if (!params.submission_id) {
  //     return null;
  //   }

  //   let submission = await this.resolveSubmission(params.submission_id);
  //   let wsIds = submission.hasMany('workspaces').ids();
  //   let wsId = wsIds.get('firstObject');
  //   let workspace = await this.resolveWorkspace(wsId);

  //   let [studentSubmissions, associatedResponses] = await Promise.all([
  //     workspace.get('submissions'),
  //     workspace.get('responses'),
  //   ]);

  //   // Include draft responses that might not be in workspace.responses yet
  //   let allResponses = this.store.peekAll('response');
  //   let additionalDrafts = allResponses.filter((response) => {
  //     const workspaceId = this.utils.getBelongsToId(response, 'workspace');
  //     const submissionId = this.utils.getBelongsToId(response, 'submission');
  //     const createdById = this.utils.getBelongsToId(response, 'createdBy');
  //     const currentUserId = this.currentUser?.user?.id;

  //     // Include drafts for this workspace/submission by current user
  //     return (
  //       workspaceId === workspace.id &&
  //       (submissionId === submission.id || response.status === 'draft') &&
  //       createdById === currentUserId &&
  //       !response.isTrashed &&
  //       !associatedResponses.find((r) => r.id === response.id)
  //     );
  //   });

  //   // Combine workspace responses with additional drafts
  //   let combinedResponses = [
  //     ...associatedResponses.toArray(),
  //     ...additionalDrafts,
  //   ];

  //   let response = null;
  //   if (params.responseId) {
  //     try {
  //       response = await this.store.findRecord('response', params.responseId);
  //     } catch (e) {
  //       console.error('Failed to load response:', e);
  //     }
  //   }

  //   if (!response && this.response) {
  //     response = this.response;
  //   }

  //   if (!response) {
  //     response = combinedResponses
  //       .filter((r) => r.responseType === 'mentor' && !r.isTrashed)
  //       .sortBy('createDate')
  //       .get('lastObject');
  //   }

  //   const model = {
  //     submission,
  //     workspace,
  //     submissions: studentSubmissions.filterBy(
  //       'student',
  //       submission.get('student')
  //     ),
  //     responses: combinedResponses,
  //     response: response || null,
  //     allResponses,
  //   };
  //   return model;
  // }

  redirect(model, transition) {
    if (!model) {
      this.router.transitionTo('responses');
      return;
    }
    const routeSubmissionId = transition?.to?.params?.submission_id;
    const latestSubmissionId = model.submission?.id;
    if (
      latestSubmissionId &&
      routeSubmissionId &&
      latestSubmissionId !== routeSubmissionId
    ) {
      this.router.replaceWith('responses.submission', latestSubmissionId, {
        queryParams: transition?.to?.queryParams,
      });
    }
  }
}
