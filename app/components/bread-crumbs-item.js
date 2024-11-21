import Component from '@glimmer/component';
import { action } from '@ember/object';
import moment from 'moment';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import isObject from 'lodash/isObject';

export default class BreadCumbsItemComponent extends Component {
  get isSelected() {
    return isEqual(this.args.item, this.args.selectedItem);
  }

  get isStarredItem() {
    return this.args.starredItemsList.includes(this.item);
  }

  get titleText() {
    if (isString(this.args.itemTitleText)) {
      return this.args.itemTitleText;
    }
    if (this.args.item && this.args.item.createDate) {
      return moment(this.args.item.createDate).format('MMM Do YYYY h:mm A');
    }
    if (isString(this.args.titleTextPath) && isObject(this.args.item)) {
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
