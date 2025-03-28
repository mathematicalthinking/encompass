import { hash } from 'rsvp';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class WorkspacesNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  beforeModel() {
    const user = this.modelFor('application');
    const isStudent = user.get('isStudent');

    if (isStudent) {
      this.router.transitionTo('/');
    }
  }
  model() {
    const currentUser = this.modelFor('application');
    return hash({
      // pdSets: this.get('store').findAll('PdSet'),
      currentUser,
      folderSets: this.store.findAll('folder-set'),
      sections: this.store.findAll('section'),
      assignments: this.store.findAll('assignment'),
      users: this.store.findAll('user'),
      problems: this.store.findAll('problem'),
    });
  }
  // Created workspaceId and is passed from component to redirect
  @action toWorkspaces(id) {
    this.router.transitionTo('workspace.work', id);
  }

  @action toWorkspace(id) {
    this.router.transitionTo('workspace/work', id);
  }
}
