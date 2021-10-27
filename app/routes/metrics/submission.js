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
        let commentsToDisplay = comments.map((comment) => {
          return {
            text: comment.text,
            constructor: {
              modelName: comment.constructor.modelName,
            },
            createdBy: {
              displayName: comment.get('createdBy.displayName'),
            },
            label: comment.label,
          };
        });
        let folders = await selection.get('taggings');
        let foldersToDisplay = folders.map((folder) => {
          return {
            name: folder.name,
            constuctor: {
              modelName: 'folder',
            },
            createdBy: {
              displayName: folder.get('createdBy.displayName'),
            },
          };
        });
        selection.children = [...foldersToDisplay, ...commentsToDisplay];
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
