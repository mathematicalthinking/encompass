Encompass.AdminProblemFilterComponent = Ember.Component.extend({
  elementId: 'admin-problem-filter',
  mainFilter: Ember.computed.alias('secondaryFilter.selectedValue'),
  showOrgFilter: Ember.computed.equal('mainFilter', 'org'),
  showPowsFilter: Ember.computed.equal('mainFilter', 'pows'),
  powsFilter: Ember.computed.alias('secondaryFilter.inputs.pows'),
  orgFilter: Ember.computed.alias('secondaryFilter.inputs.org'),

  orgFilterSubOptions: function() {
    return _.map(this.get('orgFilter.subFilters.inputs'), (val, key) => {
      return val;
    });
  }.property('orgFilter'),

  areCurrentSelections: function() {
    return !_.isEmpty(this.get('selectedValues'));
  }.property('selectedValues'),

  currentSecondaryFilter: function() {
    let inputs = this.get('secondaryFilter.inputs');
    let mainFilter = this.get('mainFilter');
    return inputs[mainFilter];
  }.property('mainFilter'),

  powsFilterOptions: function() {
    return _.map(this.get('powsFilter.secondaryFilters.inputs'), (val, key) => {
      return val;
    });
  }.property('powsFilter'),

  showUserFilter: function() {
    let val = this.get('mainFilter');
    return val === 'author' || val === 'creator';
  }.property('mainFilter'),

  selectedValues: function() {
    // let mainFilter = this.get('mainFilter');
    // let secondaryFilter = this.get('secondaryFilter');
    return this.get('currentSecondaryFilter.selectedValues');
  }.property('currentSecondaryFilter.selectedValues.[]'),

  clearSelectedValues: function() {
    this.set('currentSecondaryFilter.selectedValues', []);
    this.get('onUpdate')();
  },

  actions: {
    setMainFilter(val, $item) {
      if (!val) {
        return;
      }
      // clear state unless current filter is pows
      if (this.get('mainFilter') !== 'pows') {
        this.clearSelectedValues();
      }
      this.set('mainFilter', val);
    },
    updateSecondLevel(e) {
      let { id } = e.target;
      let secondaryFilter = this.get('powsFilter.secondaryFilters');

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
      //
      secondaryFilter.selectedValues = appliedValues;
      if (this.get('mainFilter') === 'pows') {
      //  let powSelectedValues = this.get('powsFilter.selectedValues');
       this.set('powsFilter.selectedValues', appliedValues);
      }

      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    },
    updateOrgSubFilters(e) {
      let { id } = e.target;
      let subFilters = this.get('orgFilter.subFilters');

      let targetInput = subFilters.inputs[id];
      if (!targetInput) {
        // not a valid option
        return;
      }
      // valid option, toggle the inputs isApplied value
      targetInput.isApplied = !targetInput.isApplied;

      // filter for inputs who are currently applied
      let appliedInputs = _.filter(subFilters.inputs, (input) => {
        return input.isApplied;
      });

      let appliedValues = _.map(appliedInputs, input => input.value);

      // update selectedValues on subFilters
      //
      subFilters.selectedValues = appliedValues;
      this.set('orgFilter.subFilters.selectedValues', appliedValues);


      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    },

    // $item is null if removal
    // propToUpdate should be sring prop
    updateMultiSelect(val, $item, propToUpdate) {
      if (!val || !propToUpdate) {
        return;
      }
      let isRemoval = _.isNull($item);
      let prop = this.get(propToUpdate);
      let isPropArray = _.isArray(prop);

      if (isRemoval) {
        if (!isPropArray) {
          this.set(prop, null);
        } else {
        prop.removeObject(val);
        }

        if (this.get('onUpdate')) {
          this.get('onUpdate')();
        }
        return;
      }
      if (!isPropArray) {
        this.set(prop, val);
      } else {
        prop.addObject(val);
      }

      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    }
  }
});