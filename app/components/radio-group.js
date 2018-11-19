Encompass.RadioGroupComponent = Ember.Component.extend({
  classNames: ['radio-group'],

  actions: {
    setValue(e) {
      if (!e || !e.target || !e.target.value) {
        return;
      }

      this.set('selectedValue', e.target.value);
    }
  }

});