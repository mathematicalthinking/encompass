import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  classNames: ['bread-crumbs-comp'],

  doTruncate: true,

  didReceiveAttrs() {
    this._super(...arguments);
  },

  lastItemValue: computed('itemsList.length', function () {
    return this.get('itemsList.length') - 1 || 1;
  }),

  itemsList: computed('items.[]', function () {
    return this.items || [];
  }),

  areManyItems: computed('manyItemsNum', 'itemsList.length', function () {
    let num = this.manyItemsNum;
    if (typeof num !== 'number') {
      num = 10;
    }
    return this.get('itemsList.length') >= num;
  }),

  showTruncatedView: computed('areManyItems', 'doTruncate', function () {
    return this.doTruncate && this.areManyItems;
  }),

  starredItemsList: computed('starredItems.[]', function () {
    return this.starredItems || [];
  }),

  itemsLabelText: computed('labelText', function () {
    return this.labelText || 'Rev.';
  }),

  showInfoToolTip: computed('infoToolTipText', function () {
    let text = this.infoToolTipText;
    return typeof text === 'string' && text.length > 0;
  }),

  toolTipClassNames: computed('infoToolTipPosition', function () {
    let position = this.infoToolTipPosition || 'bottom';
    return `info-text-tip simptip-position-${position} simptip-multiline simptip-smooth`;
  }),

  actions: {
    onItemSelect: function (item) {
      if (!item) {
        return;
      }
      this.onSelect(item);
    },
    showAllItems() {
      this.set('doTruncate', false);
    },
    collapse() {
      this.set('doTruncate', true);
    },
  },
});
