import { hash } from 'rsvp';
import { service } from '@ember/service';
import AuthenticatedRoute from '../_authenticated_route';

export default class WorkspacesNewRoute extends AuthenticatedRoute {
  @service store;
  @service router;
  @service currentUser;
  @service navigation;
  beforeModel() {
    if (this.currentUser.isStudent) {
      // Return the redirect so it aborts before model()'s student-forbidden findAlls run.
      return this.navigation.toHome();
    }
  }
  model() {
    const currentUser = this.currentUser.user;
    return hash({
      folderSets: this.store.findAll('folder-set'),
      sections: this.store.findAll('section'),
      assignments: this.store.findAll('assignment'),
      users: this.store.findAll('user'),
      problems: this.store.findAll('problem'),
    });
  }
}
