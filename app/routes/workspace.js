/** # Workspace Route
 * @description base route for the workspace
 * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
 * @since 1.0.0
 */
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { service } from '@ember/service';
export default class WorkspaceRoute extends Route {
  @service store;
  /*
  using regular ajax request because sideloaded  data was not being pushed in to store soon enough
  when using ember data, which was causing unnecessary api requests being made
  */

  async model(params) {
    const workspace = await this.store.findRecord(
      'workspace',
      params.workspace_id
    );

    return workspace;
  }

  @action tour() {
    //this could be factored out to a service if we have other tours
    var user = this.modelFor('application');
    user.set('seenTour', null);
    this.send('startTour', 'workspace');
  }
}
