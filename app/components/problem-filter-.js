Encompass.ProblemFilterComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-filter',
  primaryFilterValue: Ember.computed.alias('primaryFilter.value'),
  primaryFilterInputs: Ember.computed.alias('filter.primaryFilters.inputs'),
  secondaryFilter: Ember.computed.alias('primaryFilter.secondaryFilters'),
  showAdminFilters: Ember.computed.equal('primaryFilter.value', 'all'),

  primaryFilterOptions: function() {
    let mapped = _.map(this.get('primaryFilterInputs'), (val, key) => {
      return val;
    });
    return _.sortBy(mapped, 'label');
  }.property('filter'),

  secondaryFilterOptions: function() {
    return _.map(this.get('primaryFilter.secondaryFilters.inputs'), (val, key) => {
      return val;
    });
  }.property('primaryFilter'),

  actions: {
    updateTopLevel(val) {
      // need to set filter[val] : true
      // but also need to make sure the current selected item is now false
      let currentValue = this.get('primaryFilterValue');
      if (!Ember.isEqual(currentValue, val)) {
        let newPrimaryFilter = this.get('primaryFilterInputs')[val];
        this.set('primaryFilter', newPrimaryFilter);
        if (this.get('onUpdate')) {
          this.get('onUpdate')();
        }
      }
    },
    updateSecondLevel(e) {
      let { id } = e.target;
      let secondaryFilter = this.get('secondaryFilter');

      let targetInput = secondaryFilter.inputs[id];
      if (!targetInput) {
        // not a valid option
        return;
      }
      // valid option, toggle the inputs isApplied value
      targetInput.isApplied = !targetInput.isApplied;

      // filter for inputs who are currently applied
      let appliedInputs = _.filter(secondaryFilter.inputs, (input) => {
        return input.isApplied;
      });

      let appliedValues = _.map(appliedInputs, input => input.value);

      // update selectedValues on secondaryFilter

      secondaryFilter.selectedValues = appliedValues;
      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    },
    addCreator(val, $item) {
      console.log('added creator', val, $item);

    },
    removeCreator(val) {
      console.log('removed creator', val);
    }
  }
});