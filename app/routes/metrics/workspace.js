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
    const folders = await workspace.folders.toArray();
    submissions.forEach(async (submission) => {
      const answer = await submission.get('answer');

      submission.name = submission.student;
      submission.text = `<div>${
        submission.shortAnswer ? submission.shortAnswer : answer.answer
      } <br><br> ${
        submission.longAnswer ? submission.longAnswer : answer.explanation
      }</div>`;
      const selections = await submission.selections;
      submission.children = selections.toArray();
    });
    return hash({
      workspace,
      submissionsRows: submissions.toArray(),
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
