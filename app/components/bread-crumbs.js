Encompass.BreadCrumbsComponent = Ember.Component.extend({
  classNames: ['bread-crumbs-comp'],

  doTruncate: true,

  didReceiveAttrs() {
    this._super(...arguments);
  },

  lastItemValue: function() {
    return this.get('itemsList.length') - 1;
  }.property('itemsList.length'),

  itemsList: function() {
    return this.get('items') || [];
  }.property('items.[]'),

  areManyItems: function() {
    let num = this.get('manyItemsNum');
    if (typeof num !== 'number') {
      num = 10;
    }
    return this.get('itemsList.length') >= num;
  }.property('manyItemsNum', 'itemsList.length'),

  showTruncatedView: function() {
    return this.get('doTruncate') && this.get('areManyItems');
  }.property('areManyItems', 'doTruncate'),

  actions: {
    onItemSelect: function(item) {
      if (!item) {
        return;
      }
      this.get('onSelect')(item);
    },
    showAllItems() {
      this.set('doTruncate', false);
    },
    collapse() {
      this.set('doTruncate', true);
    }
  }
});