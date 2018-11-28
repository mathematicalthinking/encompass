/*global _:false */
Encompass.RadioGroupItemComponent = Ember.Component.extend({
  classNames: ['radio-group-item'],

  isSelected: function() {
    const selectedValue = this.get('selectedValue');
    const value = this.get('value');

    return _.isEqual(selectedValue, value);
  }.property('selectedValue', 'value'),

  actions: {
    onClick(val) {
      this.get('onClick')(val);
    }
  }
});