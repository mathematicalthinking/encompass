/**
 * # Workspace Submissions First Route
 * @description This route simply forwards the user to the first submission
 * @author Amir Tahvildaran, Daniel Kelly
 * @since 1.0.1
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  utils: service('utility-methods'),
  alert: service('sweet-alert'),

  model: function () {
    return this.modelFor('workspace.submissions');
  },

  afterModel: function (model, transition) {
    let workspace = this.modelFor('workspace');
    if (model.workspace.submissions.length > 0) {
      let sorted = model.workspace.submissions.sortBy('student', 'createDate');
      let firstStudent = sorted.get('firstObject.student');
      let lastRevision = sorted.getEach('student').lastIndexOf(firstStudent);
      this.transitionTo(
        'workspace-submission',
        sorted.objectAt(lastRevision).get('id')
      );
    } else {
      // no work in workspace yet; transition to info page
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
  },
});
