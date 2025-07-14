import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service sweetAlert;
  @service router;

  async beforeModel() {
    try {
      await fetch('/auth/logout');
      this.sweetAlert.showToast('success', 'Logged Out');
      this.router.transitionTo('welcome');
    } catch (err) {
      this.sweetAlert.showToast('error', 'Error Logging Out');
      console.error(err);
    }
  }
}
