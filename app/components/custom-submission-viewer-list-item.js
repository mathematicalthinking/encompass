import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CustomSubmissionViewerListItemComponent extends Component {
  get isChecked() {
    return this.args.selectedSubmissionIds.includes(this.args.submission.id);
  }

  @action onSelect() {
    this.args.onSelect(this.args.submission.id);
  }
}
