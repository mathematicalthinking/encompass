import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
export default class MetricsProblemRoute extends Route {
  @service store;
  async model({ problem_id }) {
    const problem = await this.store.findRecord('problem', problem_id);
    const workspaces = await this.store.query('workspace', {
      filterBy: {
        'submissionSet.criteria.puzzle.puzzleId': problem_id,
      },
    });
    return workspaces.map((ws) => {
      return {
        name: ws.name,
        owner: ws.get('owner.displayName'),
        commentsLength: ws.commentsLength,
        submissionsLength: ws.submissionsLength,
        selectionsLength: ws.selectionsLength,
      };
    });
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showProblemText', false);
      controller.set('relevantWorkspaces', []);
      controller.set('problemAnswers', []);
    }
  }
}
