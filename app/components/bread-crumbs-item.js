/*global _:false */
Encompass.BreadCrumbsItemComponent = Ember.Component.extend({
  classNames: ['bread-crumbs-item'],
  isSelected: function() {
    return _.isEqual(this.get('item'), this.get('selectedItem'));
  }.property('selectedItem'),

  titleText: function() {
    if (_.isString(this.get('itemTitleText'))) {
      return this.get('itemTitleText');
    }
    if (_.isString(this.get('titleTextPath')) && _.isObject(this.get('item'))) {
      let path = `item.${this.get('titleTextPath')}`;
      return this.get(path);
    }
    return '';
  }.property('itemTitleText', 'titleTextPath', 'item'),

  actions: {
    onSelect(item) {
      if (!item || this.get('isSelected')) {
        return;
      }
      this.get('onSelect')(item);
    }
  }
});