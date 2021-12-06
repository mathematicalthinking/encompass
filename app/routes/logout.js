import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class LogoutRoute extends Route {
  @service sweetAlert;
  async beforeModel() {
    try {
      await fetch('/auth/logout');
      window.location.href = '/';
      this.sweetAlert.showToast('success', 'Logged Out');
      return;
    } catch (err) {
      this.sweetAlert.showToast('error', 'Error Logging Out');
      console.log(err);
    }
  }
}
