import AuthenticatedRoute from './_authenticated_route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ResponsesRoute extends AuthenticatedRoute {
  @service store;
  model() {
    return this.store
      .query('responseThread', {
        threadType: 'all',
        page: 1,
        limit: 50,
      })
      .then((results) => {
        let meta = results.get('meta.meta');
        return {
          threads: results.toArray(),
          meta,
        };
      });
  }

  @action toSubmissionResponse(subId) {
    this.transitionTo('responses.submission', subId);
  }
  @action toResponses() {
    this.refresh();
  }
  @action toResponse(submissionId, responseId) {
    this.transitionTo('responses.submission', submissionId, {
      queryParams: { responseId: responseId },
    });
  }
}
