import { hash } from 'rsvp';
import { action } from '@ember/object';
import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class WorkspacesNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  @service currentUser;
  beforeModel() {
    if (this.currentUser.isStudent) {
      this.router.transitionTo('/');
    }
  }
  model() {
    const currentUser = this.currentUser.user;
    return hash({
      // pdSets: this.get('store').findAll('PdSet'),
      currentUser, // @TODO: remove this and use service in component
      folderSets: this.store.findAll('folder-set'),
      sections: this.store.findAll('section'),
      assignments: this.store.findAll('assignment'),
      users: this.store.findAll('user'),
      problems: this.store.findAll('problem'),
    });
  }
  // @TODO: Use navigation service in component instead of passing actions
  @action toWorkspaces(id) {
    this.router.transitionTo('workspace.work', id);
  }

  @action toWorkspace(id) {
    this.router.transitionTo('workspace/work', id);
  }
}
