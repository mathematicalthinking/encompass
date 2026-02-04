import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

async function safePreload(obj, prop) {
  try {
    await obj[prop];
  } catch (e) {
    // Silently ignore missing relationships
  }
}

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
        // Preload puzzle text relationships (guard against missing data)
        try {
          const answer = await submission.answer;
          if (answer) {
            const assignment = await answer.assignment;
            if (assignment) {
              await assignment.problem;
            }
          }
        } catch (e) {
          // Continue with fallbacks
        }

        // Preload other relationships safely
        await Promise.all([
          safePreload(submission, 'problem'),
          safePreload(submission, 'pdSet'),
          safePreload(submission, 'publication'),
          safePreload(submission, 'clazz'),
        ]);

        // Preload selection relationships
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
