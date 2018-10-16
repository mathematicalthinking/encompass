Encompass.ProblemFilterComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  // radioInputs: Ember.computed.alias('filter.topLevel.radioInputs'),
  elementId: 'problem-filter',
  topLevel: Ember.computed.alias('filter.topLevel'),
  topLevelValue: Ember.computed.alias('filter.topLevel.selectedValue'),
  secondLevel: Ember.computed.alias('filter.secondLevel'),

  currentSecondLevel: function() {
    let topLevelValue = this.get('topLevelValue');
    let secondLevel = this.get('secondLevel');
    return secondLevel[topLevelValue];

  }.property('topLevelValue'),

  didReceiveAttrs() {
    // if (this.filter) {
    //   let topLevel = filter.topLevel;
    //   let radioOptions = topLevel.radioOptions;
    //   this.set('radioOp')


    // }
    this._super(...arguments);
  },
  actions: {
    updateTopLevel(val) {
      // need to set filter[val] : true
      // but also need to make sure the current selected item is now false
      let currentValue = this.get('topLevelValue');
      if (!Ember.isEqual(currentValue, val)) {
        this.set('topLevelValue', val);
        if (this.get('onUpdate')) {
          this.get('onUpdate')();
        }
      }
      // handle showing secondary menu
    },
    updateSecondLevel(e) {
      let { id, checked } = e.target;
      console.log('id, checked', id, checked);

      let currentSecondLevel = this.get('currentSecondLevel');
      let selectedValues = currentSecondLevel.selectedValues;
      let validOptions = currentSecondLevel.inputs.map(i => i.value);

      if (!validOptions.includes(id)) {
        return;
      }
      if (checked === true) {
        selectedValues.addObject(id);
      } else if (checked === false) {
        selectedValues.removeObject(id);
      }
      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    }
  }
});