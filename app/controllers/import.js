import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ImportController extends Controller {
  @tracked isCompDirty = false;
  @tracked confirmLeaving = false;

  @action
  doConfirmLeaving(value) {
    this.confirmLeaving = value;
  }
}
