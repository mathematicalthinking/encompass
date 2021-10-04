import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class MetricsWorkspaceRoute extends Route {
  @service store;
  model(params) {
    return this.store.findRecord('workspace', params.workspace_id);
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showSelections', false);
      controller.set('showFolders', false);
      controller.set('showComments', false);
      controller.set('showResponses', false);
      controller.set('showSubmissions', false);
    }
  }
}
