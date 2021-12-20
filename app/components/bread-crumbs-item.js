import Component from '@glimmer/component';
import { action } from '@ember/object';
import * as dayjs from 'dayjs';
import _ from 'underscore';

export default class BreadCumbsItemComponent extends Component {
  get isSelected() {
    return _.isEqual(this.args.item, this.args.selectedItem);
  }

  get isStarredItem() {
    return this.args.starredItemsList.includes(this.item);
  }

  get titleText() {
    if (_.isString(this.args.itemTitleText)) {
      return this.args.itemTitleText;
    }
    if (this.args.item && this.args.item.createDate) {
      return dayjs(this.args.item.createDate).format('MMM Do YYYY h:mm A');
    }
    if (_.isString(this.args.titleTextPath) && _.isObject(this.args.item)) {
      return this.args.item[this.args.titleTextPath];
    }
    return '';
  }
  @action onSelect(item) {
    if (!item || this.isSelected) {
      return;
    }
    this.args.onSelect(item);
  }
}
