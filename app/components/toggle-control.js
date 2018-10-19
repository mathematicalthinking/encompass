Encompass.ToggleControlComponent = Ember.Component.extend({
  classNames: ['toggle-control'],

  didReceiveAttrs() {
    if (this.classToAdd) {
      this.get('classNames').addObject(classToAdd);
    }



    this._super(...arguments);
  },

  //attrs passed in
  //propToToggle
  // initialValue
  // firstValue
  actions: {
    onToggle() {
      //
    }
  }
});