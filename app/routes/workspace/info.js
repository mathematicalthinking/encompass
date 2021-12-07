/** # Workspace Work Route
 * @description The workspace info route, displays detail of a workspace and lets user update settings
 * @author Tim Leonard
 * @since 3.0.0
 */
import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class WorkspaceInfoRoute extends Route {
  @service store;
  async model() {
    let workspace = this.modelFor('workspace');
    let originalCollaborators = [];
    if (workspace.get('collaborators.length')) {
      originalCollaborators = await this.store.query('user', {
        ids: workspace.collaborators,
      });
    }
    return hash({
      workspace,
      originalCollaborators: originalCollaborators.toArray(),
    });
  }
}
