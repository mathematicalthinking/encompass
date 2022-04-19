import { inject as service } from '@ember/service';
import ConfirmLeavingRoute from '../_confirm_leaving_route';
import { action } from '@ember/object';
export default class ResponsesRoute extends ConfirmLeavingRoute {
  @service('utility-methods') utils;
  @service store;
  model(params) {
    return this.store.findRecord('response', params.response_id);
  }

  redirect(model, transition) {
    if (!model) {
      this.transitionTo('responses');
    } else {
      let submissionId = this.utils.getBelongsToId(model, 'submission');
      if (this.utils.isValidMongoId(submissionId)) {
        this.transitionTo('responses.submission', submissionId, {
          queryParams: { responseId: model.get('id') },
        });
      } else {
        this.transitionTo('responses');
      }
    }
  }

  @action toResponseInfo(response) {
    this.transitionTo('response', response.get('id'));
  }
  @action toResponses() {
    this.transitionTo('responses');
  }
  @action toNewResponse(submissionId, workspaceId) {
    this.transitionTo('responses.new.submission', submissionId, {
      queryParams: { workspaceId: workspaceId },
    });
  }
}
