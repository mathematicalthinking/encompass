/*global _:false */
import Component from '@ember/component';
import { computed } from '@ember/object';
import moment from 'moment';

export default Component.extend({
  classNames: ['bread-crumbs-item'],

  isSelected: computed('selectedItem', function () {
    return _.isEqual(this.item, this.selectedItem);
  }),

  isStarredItem: computed('starredItemsList.[]', 'item', function () {
    return this.starredItemsList.includes(this.item);
  }),

  titleText: computed(
    'itemTitleText',
    'titleTextPath',
    'item',
    'item.createDate',
    function () {
      if (_.isString(this.itemTitleText)) {
        return this.itemTitleText;
      }
      if (this.get('item.createDate')) {
        return moment(this.get('item.createDate')).format('MMM Do YYYY h:mm A');
      }
      if (_.isString(this.titleTextPath) && _.isObject(this.item)) {
        let path = `item.${this.titleTextPath}`;
        return this.get(path);
      }
      return '';
    }
  ),

  actions: {
    onSelect(item) {
      if (!item || this.isSelected) {
        return;
      }
      this.onSelect(item);
    },
  },
});
