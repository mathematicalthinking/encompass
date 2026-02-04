import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';
export default class MetricsWorkspaceRoute extends Route {
  @service store;
  async model(params) {
    const workspace = await this.store.findRecord(
      'workspace',
      params.workspace_id
    );
    const submissions = await workspace.submissions;
    await Promise.all(
      submissions.map(async (submission) => {
        await submission.problem;
        const answer = await submission.answer;
        if (answer) {
          await answer.problem;
          const assignment = await answer.assignment;
          if (assignment) {
            await assignment.problem;
          }
        }
        const selections = await submission.selections;
        await Promise.all(
          selections.map(async (selection) => {
            await selection.comments;
            await selection.taggings;
          })
        );
      })
    );
    return hash({
      workspace,
      submissions,
    });
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
