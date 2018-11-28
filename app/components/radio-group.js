Encompass.RadioGroupComponent = Ember.Component.extend({
  classNames: ['radio-group'],
  utils: Ember.inject.service('utility-methods'),

  actions: {
    setValue(val) {
      if (this.get('utils').isNullOrUndefined(val)) {
        return;
      }

      this.set('selectedValue', val);
    }
  }

});