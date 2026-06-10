import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class UserNtfsService extends Service {
  @tracked notifications = [];
  @tracked areNtfsLoaded = false;

  async setupProperties(user) {
    this.notifications = await user.notifications;
    this.areNtfsLoaded = true;
  }

  get newNotifications() {
    return this.notifications.filter((notification) => {
      return !notification.wasSeen && !notification.isTrashed;
    });
  }
}
