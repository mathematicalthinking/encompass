import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import ConfirmLeavingRoute from '../_confirm_leaving_route';

export default Route.extend(ConfirmLeavingRoute, {
  utils: service('utility-methods'),

  model: function (params) {
    return this.store.findRecord('response', params.response_id);
  },

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
  },

  actions: {
    toResponseInfo(response) {
      this.transitionTo('response', response.get('id'));
    },
    toResponses() {
      this.transitionTo('responses');
    },
    toNewResponse: function (submissionId, workspaceId) {
      this.transitionTo('responses.new.submission', submissionId, {
        queryParams: { workspaceId: workspaceId },
      });
    },
  },
});
