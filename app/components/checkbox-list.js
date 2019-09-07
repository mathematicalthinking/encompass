Encompass.CheckboxListComponent = Ember.Component.extend({
  classNames: ['checkbox-list'],

  selectedItems: [],
  isToggledAll: false,

  selectAllLabel: function() {
    let isOn = this.get('isToggledAll');
    return isOn ? 'Deselect All' : 'Select All';
  }.property('isToggledAll'),

  didReceiveAttrs() {
    let initialSelectedItems = this.get('initialSelectedItems');
    if (initialSelectedItems) {
      this.get('selectedItems').addObjects(initialSelectedItems);
    }
  },

  actions: {
    onItemSelect(item, wasSelected) {
      if (!item) {
        return;
      }
      let selectedItems = this.get('selectedItems');
      if (wasSelected) {
        selectedItems.removeObject(item);
      } else {
        selectedItems.addObject(item);
      }
    },
    onToggleAll() {
     let wasSelected = this.get('isToggledAll');
      if (wasSelected) {
        this.set('selectedItems', []);
      } else {
        this.set('selectedItems', this.get('items'));
      }
      this.toggleProperty('isToggledAll');

    }
  }
});