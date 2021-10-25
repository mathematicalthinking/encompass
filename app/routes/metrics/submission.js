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
        let folders = await selection.get('folders');
        folders = folders.toArray();
        console.log(folders);
        selection.children = [...comments, ...folders];
      });
      submission.children = selections.toArray();
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
