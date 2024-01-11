import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class BreadCrumbsComponent extends Component {
  @tracked doTruncate = true;

  get lastItemValue() {
    return this.itemsList.length - 1 || 1;
  }

  get itemsList() {
    return this.args.items || [];
  }

  get areManyItems() {
    return this.itemsList.length >= 10;
  }

  get showTruncatedView() {
    return this.doTruncate && this.areManyItems;
  }

  get starredItemsList() {
    return this.args.starredItems || [];
  }

  get itemsLabelText() {
    return this.args.labelText || 'Current Revision:';
  }

  get showInfoToolTip() {
    let text = this.args.infoToolTipText;
    return typeof text === 'string' && text.length > 0;
  }

  get toolTipClassNames() {
    let position = this.args.infoToolTipPosition || 'bottom';
    return `info-text-tip simptip-position-${position} simptip-multiline simptip-smooth`;
  }

  @action onItemSelect(item) {
    if (!item) {
      return;
    }
    this.args.onSelect(item);
  }
  @action showAllItems() {
    this.doTruncate = false;
  }
  @action collapse() {
    this.doTruncate = true;
  }
}
