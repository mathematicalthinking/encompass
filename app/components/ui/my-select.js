import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class MySelectComponent extends Component {
  @action
  selectChange(event) {
    let selectedIndex = event.target.selectedIndex;
    if (this.args.prompt && selectedIndex > 0) {
      selectedIndex -= 1;
    }

    const selectedItem = this.args.content[selectedIndex];
    if (this.args.action) {
      this.args.action(selectedItem);
    }
  }

  @action
  clearSelection() {
    if (this.args.action) {
      this.args.action(null);
    }
  }
}
