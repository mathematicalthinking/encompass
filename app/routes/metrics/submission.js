import Route from '@ember/routing/route';
import { hash } from 'rsvp';
import { inject as service } from '@ember/service';

export default class MetricsSubmissionRoute extends Route {
  @service store;
  async model({ submission_id }) {
    const submission = await this.store.findRecord('submission', submission_id);
    const answer = await submission.answer.get('id');
    const allSubmissions = await this.store.query('submission', {
      findByAnswer: true,
      answer,
    });
    const workspaces = await allSubmissions.map((submission) =>
      submission.workspaces.objectAt(0)
    );
    return hash({
      submission,
      answer,
      allSubmissions,
      workspaces,
    });
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.set('showSelections', false);
      controller.set('showComments', false);
      controller.set('showResponses', false);
      controller.set('showFolders', false);
    }
  }
}
