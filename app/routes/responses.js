import AuthenticatedRoute from './_authenticated_route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class ResponsesRoute extends AuthenticatedRoute {
  @service router;
  @action toSubmissionResponse(subId) {
    this.router.transitionTo('responses.submission', subId);
  }
  @action toResponses() {
    this.refresh();
  }
  @action toResponse(submissionId, responseId) {
    this.router.transitionTo('responses.submission', submissionId, {
      queryParams: { responseId: responseId },
    });
  }
}
