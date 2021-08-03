import Route from '@ember/routing/route';

export default class MetricsSubmissionRoute extends Route {
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showSelections', false);
      controller.set('showComments', false);
      controller.set('showResponses', false);
      controller.set('showFolders', false);
    }
  }
}
