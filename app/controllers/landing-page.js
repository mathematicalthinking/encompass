import Controller from '@ember/controller';
import config from 'encompass/config/environment';

export default class LandingPageController extends Controller {
  version = config.APP.VERSION;
  buildDate = config.APP.BUILD_DATE;
}
