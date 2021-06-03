Encompass.BreadCrumbsComponent = Ember.Component.extend({
  classNames: ['bread-crumbs-comp'],

  doTruncate: true,
  infoToolTipPosition: "top",
  
  infoToolTipText: 'Revisions are sorted from oldest to newest, left to right. Star indicates that a revision has been mentored (or you have saved a draft)',

  didReceiveAttrs() {
    this._super(...arguments);
  },

  lastItemValue: function() {
    return this.get('itemsList.length') - 1 || 1;
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

  starredItemsList: function() {
    return this.get('starredItems') || [];
  }.property('starredItems.[]'),

  itemsLabelText: function() {
    return this.get('labelText') || 'Rev.';
  }.property('labelText'),

  showInfoToolTip: function() {
    let text = this.get('infoToolTipText');
    return typeof text === 'string' && text.length > 0;
  }.property('infoToolTipText'),

  toolTipClassNames: function() {
    let position = this.get('infoToolTipPosition') || 'bottom';
    return `info-text-tip simptip-position-${position} simptip-multiline simptip-smooth`;
  }.property('infoToolTipPosition'),

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