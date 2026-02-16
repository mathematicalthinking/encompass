import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class LogoutRoute extends Route {
  @service sweetAlert;
  @service router;
  @service navigation;

  async beforeModel() {
    try {
      await fetch('/auth/logout');
      this.sweetAlert.showToast('success', 'Logged Out');
      this.navigation.toHome({ fullReload: true });
    } catch (err) {
      this.sweetAlert.showToast('error', 'Error Logging Out');
      console.error(err);
    }
  }
}
