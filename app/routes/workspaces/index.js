/**
 * # Workspaces Index Route
 * @description Route to view all workspaces
 * @author Amir Tahvildaran <amir@mathforum.org>, Tim Leonard <tleonard@21pstem.org>
 * @since 1.0.0
 */
import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class WorkspacesIndexRoute extends AuthenticatedRoute {
  @service store;
  templateName = 'workspaces/workspaces';

  model() {
    const user = this.modelFor('application');
    let workspaceCriteria = {};

    if (!user.get('isAdmin')) {
      workspaceCriteria = {
        filterBy: {
          $or: [{ createdBy: user.id }, { owner: user.id }],
        },
      };
    }
    return hash({
      currentUser: user,
      organizations: this.store.findAll('organization'),
      workspaces: this.store.query('workspace', workspaceCriteria),
    });
  }

  @action reload() {
    this.refresh();
  }
}
