/*global _:false */
Encompass.BreadCrumbsItemComponent = Ember.Component.extend({
  classNames: ['bread-crumbs-item'],

  isSelected: function() {
    return _.isEqual(this.get('item'), this.get('selectedItem'));
  }.property('selectedItem'),

  isStarredItem: function() {
    return this.get('starredItemsList').includes(this.get('item'));
  }.property('starredItemsList.[]', 'item'),

  titleText: function() {
    if (_.isString(this.get('itemTitleText'))) {
      return this.get('itemTitleText');
    }
    if (this.get('item.createDate')) {
      return moment(this.get('item.createDate')).format('MMM Do YYYY h:mm A');
    }
    if (_.isString(this.get('titleTextPath')) && _.isObject(this.get('item'))) {
      let path = `item.${this.get('titleTextPath')}`;
      return this.get(path);
    }
    return '';
  }.property('itemTitleText', 'titleTextPath', 'item', 'item.createDate'),

  actions: {
    onSelect(item) {
      if (!item || this.get('isSelected')) {
        return;
      }
      this.get('onSelect')(item);
    }
  }
});