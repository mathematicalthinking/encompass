Encompass.CheckboxListItemComponent = Ember.Component.extend({
  classNames: ['checkbox-list-item'],

  isSelected: function() {
    let items = this.get('selectedItems') || [];
    return items.includes(this.get('item'));
  }.property('selectedItems.[]', 'item'),

  value: function() {
    return this.get('item.id');
  }.property('item.id'),

  displayValue: function() {
    let propName = `item.${this.get('displayProp')}`;
    return this.get(propName);
  }.property('item', 'displayProp'),

  actions: {
    onSelect() {
      this.get('onSelect')(this.get('item'), this.get('isSelected'));
    }
  }
});