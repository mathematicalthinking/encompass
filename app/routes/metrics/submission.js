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
    return hash({
      submission,
      answer,
      allSubmissions: allSubmissions.toArray(),
    });
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.showWorkspaces = false;
      controller.selectedWorkspaces = [];
    }
  }
}
