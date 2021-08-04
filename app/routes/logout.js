import Route from '@ember/routing/route';
import $ from 'jquery';

export default class LogoutRoute extends Route {
  beforeModel() {
    return $.get('/auth/logout').then(() => {
      window.location.href = '/';
    });
  }
}
