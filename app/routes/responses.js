import AuthenticatedRoute from './_authenticated_route';
import { action } from '@ember/object';

export default class ResponsesRoute extends AuthenticatedRoute {
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
