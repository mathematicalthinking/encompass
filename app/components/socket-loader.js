import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class SocketLoaderComponent extends Component {
  @service currentUser;
  @service socketIo;

  constructor() {
    super(...arguments);
    this.setup();
  }

  async setup() {
    const user = this.currentUser.user;
    if (user && !user.isGuest) {
      this.socketIo.setupSocket(user);
    }
  }
}
