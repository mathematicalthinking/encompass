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
    const submissionsRows = await Promise.all(
      submissions.map(async (submission) => {
        const selections = await submission.selections.toArray();
        selections.forEach((selection) => {
          selection.type = 'Selection';
        });
        const submissionText = `<div>${
          submission.shortAnswer
            ? submission.shortAnswer
            : submission.answer.answer
        } <br> ${
          submission.longAnswer
            ? submission.longAnswer
            : submission.answer.explanation
        }</div>`;
        return {
          type: 'Submission',
          name: submission.student,
          text: submissionText,
          children: selections,
        };
      })
    );
    return hash({
      workspace,
      submissionsRows,
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
