/**
 * # Workspaces Index Route
 * @description Route to view all workspaces
 * @author Amir Tahvildaran <amir@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
 * @since 1.0.0
 */
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class WorkspacesIndexRoute extends AuthenticatedRoute {
  @service store;
  @service currentUser;
  templateName = 'workspaces/workspaces';

  model() {
    let workspaceCriteria = {};

    if (!this.currentUser.isAdmin) {
      workspaceCriteria = {
        filterBy: {
          $or: [
            { createdBy: this.currentUser.id },
            { owner: this.currentUser.id },
          ],
        },
      };
    }
    return hash({
      organizations: this.store.findAll('organization'),
      workspaces: this.store.query('workspace', workspaceCriteria),
    });
  }

  @action reload() {
    this.refresh();
  }
}
