import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class MetricsSubmissionRoute extends Route {
  @service store;
  async model({ submission_id }) {
    const submission = await this.store.findRecord('submission', submission_id);
    const answer = await submission.answer.get('id');
    let allSubmissions = await this.store.query('submission', {
      findByAnswer: true,
      answer,
    });
    allSubmissions = await allSubmissions.toArray();
    allSubmissions.forEach(async (submission) => {
      submission.text = '';
      const selections = await submission.selections;
      selections.forEach(async (selection) => {
        let comments = await selection.comments;
        comments = comments.toArray();
        let folders = await selection.get('taggings');
        folders = folders.toArray();
        selection.children = [...folders, ...comments];
      });
      submission.children = selections.toArray();
    });
    return hash({
      submission,
      answer,
      allSubmissions,
    });
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.showWorkspaces = false;
      controller.selectedWorkspaces = [];
    }
  }
}
