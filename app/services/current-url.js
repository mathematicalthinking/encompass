import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentUrlService extends Service {
  @tracked currentUrl = null;

  setCurrentUrl(url) {
    this.currentUrl = url;
  }
}
