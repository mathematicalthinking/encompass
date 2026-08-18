import { hash } from 'rsvp';
import AuthenticatedRoute from './_authenticated_route';

export default class ImportRoute extends AuthenticatedRoute {
  model() {
    return hash({
      sections: this.store.findAll('section'),
      folderSets: this.store.findAll('folderSet'),
      users: this.store.findAll('user'),
      problems: this.store.findAll('problem'),
    });
  }
}
