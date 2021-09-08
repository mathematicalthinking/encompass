import Controller from '@ember/controller';
import { action } from '@ember/object';
export default class SectionsSectionController extends Controller {
  @action refresh() {
    this.send('refreshModel');
  }
}
