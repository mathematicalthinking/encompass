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

    // Safely access permissions to get user IDs
    const permissions = workspace.get('permissions');
    if (Array.isArray(permissions) && permissions.length > 0) {
      // Extract only user IDs (plain values, not objects)
      const userIds = permissions.map((p) => p.user).filter((id) => id);
      if (userIds.length > 0) {
        originalCollaborators = await this.store.query('user', {
          ids: userIds,
        });
      }
    }
    return hash({
      workspace,
      originalCollaborators: originalCollaborators.toArray(),
    });
  }
}
