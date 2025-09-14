/** # Workspace Route
 * @description base route for the workspace
 * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>, Tim Leonard <tleonard@21pstem.org>, Irv Katz <exidy80@gmail.com>
 * @since 1.0.0
 */
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class WorkspaceRoute extends Route {
  @service store;
  @service currentUser;
  
  async model(params) {
    return this.store.findRecord('workspace', params.workspace_id);
  }

  // @TODO Refactor tour-handling to a service
  @action
  tour() {
    const user = this.currentUser.user;
    if (user) {
      // local-only flag; no save. @TODO is this correct?
      user.seenTour = null;
    }
    // Uses action bubbling because we handle `startTour` upstream
    this.send('startTour', 'workspace');
  }
}
