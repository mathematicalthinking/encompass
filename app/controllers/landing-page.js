import Controller from '@ember/controller';
import config from 'encompass/config/environment';

export default class LandingPageController extends Controller {
  version = config.APP.VERSION;
  buildDate = new Date(config.APP.BUILD_DATE).toLocaleString();
}
