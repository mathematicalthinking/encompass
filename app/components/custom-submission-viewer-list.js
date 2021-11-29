import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class CustomSbumissionViewerComponent extends Component {
  @tracked isChecked = false;

  @action onSelect(submissionId) {
    this.args.onSelect(submissionId);
  }
  @action toggleSelect() {
    this.isChecked = !this.isChecked;
    if (this.isChecked) {
      this.args.onSelectAll();
    } else {
      this.args.onUnselectAll();
    }
  }
}
