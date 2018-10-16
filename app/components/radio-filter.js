Encompass.RadioFilterComponent = Ember.Component.extend({
  classNames: ['radio-filter'],
  didReceiveAttrs() {

    this._super(...arguments);
  },
  actions: {
    onClick(val) {
      this.get('onClick')(val);
    }
  }
});