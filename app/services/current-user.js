import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUserService extends Service {
  @tracked user = {};

  setUser(data) {
    this.user = data;
  }
}
