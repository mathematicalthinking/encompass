import Route from '@ember/routing/route';

export default class MetricsProblemRoute extends Route {
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showProblemText', false);
      controller.set('relevantWorkspaces', []);
      controller.set('problemAnswers', []);
    }
  }
}
