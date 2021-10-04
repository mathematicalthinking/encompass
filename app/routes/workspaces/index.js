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
  async model() {
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
      organizations: await this.store.findAll('organization'),
      workspaces: await this.store.query('workspace', workspaceCriteria),
    });
    /*
    return store.cache('workspace').then(function(model){
      return model;
      //return store.filter('workspace', route.filter.bind(route));
      //stackoverflow.com/questions/24439394/emberjs-override-route-filter-without-global/24439468#24439468
    });
    */
  }

  renderTemplate() {
    this.render('workspaces/workspaces');
  }

  @action reload() {
    this.refresh();
  }
}
