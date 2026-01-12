import Service from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentSelectionService extends Service {
  @tracked selection = null;

  get hasSelection() {
    return !!this.selection;
  }

  setSelection(selection) {
    this.selection = selection;
  }

  clearSelection() {
    this.selection = null;
  }

  isCurrentSelection(selectionId) {
    return this.selection?.id === selectionId;
  }
}
