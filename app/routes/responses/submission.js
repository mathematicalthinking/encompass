import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';
import { action } from '@ember/object';

export default class ResponsesRoute extends AuthenticatedRoute {
  @service('utility-methods') utils;
  @service store;
  @service router;
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

    let response = null;
    if (params.responseId) {
      try {
        response = await this.store.findRecord('response', params.responseId);
      } catch (e) {
        console.error('Failed to load response:', e);
      }
    }

    if (!response && this.response) {
      response = this.response;
    }

    if (!response) {
      response = associatedResponses
        .filterBy('responseType', 'mentor')
        .filterBy('isTrashed', false)
        .sortBy('createDate')
        .get('lastObject');
    }

    let allResponses = this.store.peekAll('response');

    const model = {
      submission,
      workspace,
      submissions: studentSubmissions.filterBy(
        'student',
        submission.get('student')
      ),
      responses: associatedResponses,
      response: response || null,
      allResponses,
    };
    return model;
  }

  redirect(model, transition) {
    if (!model) {
      this.router.transitionTo('responses');
    }
  }
}
