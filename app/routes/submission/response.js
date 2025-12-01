import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ResponsesRoute extends Route {
  @service('utility-methods') utils;
  @service store;
  @service router;
  model(params) {
    return this.store.findRecord('response', params.response_id);
  }

  redirect(model) {
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
}
