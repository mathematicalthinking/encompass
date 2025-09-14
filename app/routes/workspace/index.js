import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class WorkspaceIndexRoute extends Route {
  @service router;

  redirect(model) {
    // only fires when the URL is exactly /workspaces/:id, which would only happens if a
    // user types it directly
    this.router.replaceWith('workspace.work', model.id);
  }
}
