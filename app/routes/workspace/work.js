/** # Workspace Work Route
 * @description The workspace work route, really just a redirect to the first submission of the workspace
 * @author Amir Tahvildaran, Daniel Kelly
 * @since 1.0.1
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  alert: service('sweet-alert'),

  afterModel: async function (model, transition) {
    let hasSubmissions = await model.workspace.submissions.length > 0;

    if (hasSubmissions) {
      this.transitionTo('workspace.submissions.first');
    } else {
      // no work in workspace yet, redirect to info page
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
