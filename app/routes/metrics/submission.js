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
    const workspaces = await allSubmissions
      //submission model has an array of workspaces, usually just one workspace, so need to get the first object
      .map((submission) => submission.workspaces.objectAt(0))
      //sometimes a workspaces has mulitple copies of the same exact answer as diferent submissions
      .filter((workspace, index, array) => array.indexOf(workspace) === index);
    return hash({
      submission,
      answer,
      allSubmissions,
      workspaces,
    });
  }
  resetController(controller, isExiting, transition) {
    if (isExiting && transition.targetName !== 'error') {
      controller.showWorkspaces = false;
      controller.selectedWorkspaces = [];
    }
  }
}
