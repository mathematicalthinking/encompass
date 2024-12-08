import { inject as service } from '@ember/service';
import ConfirmLeavingRoute from '../_confirm_leaving_route';
import { action } from '@ember/object';
export default class ResponsesRoute extends ConfirmLeavingRoute {
  @service('utility-methods') utils;
  @service store;
  @service router;
  model(params) {
    return this.store.findRecord('response', params.response_id);
  }

  redirect(model, transition) {
    if (!model) {
      this.router.transitionTo('responses');
    } else {
      let submissionId = this.utils.getBelongsToId(model, 'submission');
      if (this.utils.isValidMongoId(submissionId)) {
        this.router.transitionTo('responses.submission', submissionId, {
          queryParams: { responseId: model.get('id') },
        });
      } else {
        this.router.transitionTo('responses');
      }
    }
  }

  @action toResponseInfo(response) {
    this.router.transitionTo('response', response.get('id'));
  }
  @action toResponses() {
    this.router.transitionTo('responses');
  }
  @action toNewResponse(submissionId, workspaceId) {
    this.router.transitionTo('responses.new.submission', submissionId, {
      queryParams: { workspaceId: workspaceId },
    });
  }
}
