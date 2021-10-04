import Route from '@ember/routing/route';

export default class LogoutRoute extends Route {
  beforeModel() {
    try {
      fetch('/auth/logout');
      return (window.location.href = '/');
    } catch (err) {
      console.log(err);
    }
  }
}
