Encompass.RadioFilterComponent = Ember.Component.extend({
  classNames: ['radio-filter'],

  didReceiveAttrs() {

    this._super(...arguments);
  },

  isSelected: function() {
    let groupValue = this.get('groupValue');
    let ownValue = this.get('inputValue');
    return _.isEqual(groupValue, ownValue);
  }.property('groupValue'),
  actions: {
    onClick(val) {
      this.get('onClick')(val);
    }
  }
});