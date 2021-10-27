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
    submissions.forEach(async (submission) => {
      const answer = await submission.get('answer');

      submission.name = submission.student;
      submission.text = `<div>${
        submission.shortAnswer ? submission.shortAnswer : answer.answer
      } <br><br> ${
        submission.longAnswer ? submission.longAnswer : answer.explanation
      }</div>`;
      let selections = await submission.selections;
      selections = selections.toArray();
      selections.forEach(async (selection) => {
        let comments = await selection.comments;
        let commentsToDisplay = comments.map((comment) => {
          return {
            text: comment.text,
            constructor: {
              modelName: comment.constructor.modelName,
            },
            createdBy: {
              displayName: comment.get('createdBy.displayName'),
            },
          };
        });
        selection.children = commentsToDisplay;
      });
      submission.children = selections;
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
