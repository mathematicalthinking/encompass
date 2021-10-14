import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
export default class MetricsProblemRoute extends Route {
  @service store;
  async model() {
    const workspaces = await this.store.query('workspace', {
      filterBy: {
        'submissionSet.criteria.puzzle.puzzleId': this.model.id,
      },
    });
    return workspaces.toArray();
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showProblemText', false);
      controller.set('relevantWorkspaces', []);
      controller.set('problemAnswers', []);
    }
  }
}
