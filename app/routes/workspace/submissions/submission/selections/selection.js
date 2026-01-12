import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class SelectionRoute extends Route {
  @service store;
  @service currentSelection;

  model(params) {
    return this.store.findRecord('selection', params.selection_id);
  }

  afterModel(model) {
    this.currentSelection.setSelection(model);
  }

  deactivate() {
    this.currentSelection.clearSelection();
  }
}
