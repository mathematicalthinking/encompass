// app/routes/responses.js
import AuthenticatedRoute from '../_authenticated_route';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class ResponsesRoute extends AuthenticatedRoute {
  @service('utility-methods') utils;
  @service store;
  @service router;

  // keep existing QP behavior
  queryParams = {
    responseId: { refreshModel: true },
  };

  // capture a preselected response (by ?responseId=) before model loads
  beforeModel(transition) {
    const qp = transition.to?.queryParams ?? transition.intent?.queryParams;
    const responseId = qp?.responseId;

    const allResponses = this.store.peekAll('response');

    this.response = this.utils.isValidMongoId(responseId)
      ? [...allResponses].find((r) => r.id === responseId) ?? null
      : null;
  }

  // keep these helpers for now (you'll move to a service later)
  resolveSubmission(submissionId) {
    const peeked = this.store.peekRecord('submission', submissionId);
    return peeked ? Promise.resolve(peeked) : this.store.findRecord('submission', submissionId);
  }

  resolveWorkspace(workspaceId) {
    const peeked = this.store.peekRecord('workspace', workspaceId);
    return peeked ? Promise.resolve(peeked) : this.store.findRecord('workspace', workspaceId);
  }

  async model(params) {
    if (!params.submission_id) return null;

    const allResponses = this.store.peekAll('response');

    const submission = await this.resolveSubmission(params.submission_id);

    // hasMany(...).ids() returns a native array in ED 4.x
    const wsIds = submission.hasMany('workspaces').ids();
    const wsId = wsIds[0];
    const workspace = await this.resolveWorkspace(wsId);

    // await related collections (ManyArray/PromiseManyArray)
    const [studentSubmissions, associatedResponses] = await Promise.all([
      workspace.submissions,
      workspace.responses,
    ]);

    let response = this.response;

    if (!response) {
      const mentorResponses = [...associatedResponses].filter((r) => r.responseType === 'mentor');
      mentorResponses.sort((a, b) => new Date(a.createDate) - new Date(b.createDate));
      response = mentorResponses[mentorResponses.length - 1] ?? null;
    }

    if (params.responseId) {
      response = await this.store.findRecord('response', params.responseId);
    }

    return {
      submission,
      workspace,
      submissions: [...studentSubmissions].filter(
        (s) => s.student === submission.student
      ),
      responses: [...associatedResponses],
      response,
      allResponses: [...allResponses],
    };
  }

  redirect(model) {
    if (!model) this.router.transitionTo('responses');
  }

  // keep navigation helpers (to be moved to a service later)
  @action toResponseSubmission(subId) {
    this.router.transitionTo('responses.submission', subId);
  }

  @action toResponse(submissionId, responseId) {
    this.router.transitionTo('responses.submission', submissionId, {
      queryParams: { responseId },
    });
  }

  @action toResponses() {
    this.router.transitionTo('responses');
  }

  @action toNewResponse(submissionId, workspaceId) {
    this.router.transitionTo('responses.new.submission', submissionId, {
      queryParams: { workspaceId },
    });
  }

  // route hook (not an action)
  renderTemplate() {
    this.render('responses/response');
  }
}