/**
 * # Workspace Submissions First Route
 * @description This route simply forwards the user to the first submission
 * @author Amir Tahvildaran, Daniel Kelly
 * @since 1.0.1
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class SubmissionFirstRoute extends Route {
  @service('utility-methods') utils;
  @service('sweet-alert') alert;

  async model() {
    return this.modelFor('workspace.submissions');
  }

  @action
  async afterModel(submissions) {
    let workspace = this.modelFor('workspace');

    if (workspace.submissions.length > 0) {
      let sorted = submissions.sortBy('student', 'createDate');
      let firstSubmission = sorted[0];
      let queryParams = { id: firstSubmission.id };

      await this.transitionTo({ queryParams });
    } else {
      // No work in workspace yet; transition to info page
      this.alert.showToast(
        'info',
        'Workspace does not have any submissions yet',
        'bottom-end',
        3000,
        false,
        null
      );

      this.transitionTo('workspace.info');
    }
  }
}
