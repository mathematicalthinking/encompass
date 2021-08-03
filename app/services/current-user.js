import Service from '@ember/service';

export default class CurrentUserService extends Service {
  user = {};

  setUser(data) {
    this.user = data;
  };
}
