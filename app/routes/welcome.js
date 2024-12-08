// app/routes/welcome.js
import Route from '@ember/routing/route';
import config from 'encompass/config/environment';

export default class WelcomeRoute extends Route {
  model() {
    return {
      version: config.APP.VERSION,
      buildDate: config.APP.BUILD_DATE,
    };
  }
}
