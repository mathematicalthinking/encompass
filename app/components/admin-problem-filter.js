import Component from '@ember/component';
import { computed } from '@ember/object';
/*global _:false */
import { alias, equal } from '@ember/object/computed';

export default Component.extend({
  elementId: 'admin-problem-filter',
  mainFilter: alias('secondaryFilter.selectedValue'),
  showOrgFilter: equal('mainFilter', 'org'),
  showPowsFilter: equal('mainFilter', 'pows'),
  powsFilter: alias('secondaryFilter.inputs.pows'),
  orgFilter: alias('secondaryFilter.inputs.org'),
  selectedOrgSubFilters: alias(
    'secondaryFilter.inputs.org.subFilters.selectedValues'
  ),

  willDestroyElement: function () {
    if (this.mainFilter !== 'pows') {
      this.clearSelectedValues();
    }
  },

  orgFilterSubOptions: computed('orgFilter', function () {
    return _.map(this.orgFilter.subFilters.inputs, (val, key) => {
      return val;
    });
  }),

  areCurrentSelections: computed('selectedValues', function () {
    return !_.isEmpty(this.selectedValues);
  }),

  currentSecondaryFilter: computed('mainFilter', function () {
    let inputs = this.secondaryFilter.inputs;
    let mainFilter = this.mainFilter;
    return inputs[mainFilter];
  }),

  powsFilterOptions: computed('powsFilter', function () {
    return _.map(this.powsFilter.secondaryFilters.inputs, (val, key) => {
      return val;
    });
  }),

  showUserFilter: computed('mainFilter', function () {
    let val = this.mainFilter;
    return val === 'author' || val === 'creator';
  }),

  selectedValues: computed(
    'currentSecondaryFilter.selectedValues.[]',
    function () {
      return this.currentSecondaryFilter.selectedValues;
    }
  ),

  clearSelectedValues: function () {
    this.set('currentSecondaryFilter.selectedValues', []);
    // this.onUpdate();
  },
  initialMainFilterItems: computed('mainFilter', function () {
    let val = this.mainFilter;
    return [val];
  }),

  actions: {
    setMainFilter(val, $item) {
      if (!val) {
        return;
      }
      // clear state unless current filter is pows
      if (this.mainFilter !== 'pows') {
        this.clearSelectedValues();
      }
      this.set('mainFilter', val);
      this.onUpdate();
    },
    updateSecondLevel(e) {
      let { id } = e.target;
      let secondaryFilter = this.powsFilter.secondaryFilters;

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

      let appliedValues = _.map(appliedInputs, (input) => input.value);

      // update selectedValues on secondaryFilter
      //
      secondaryFilter.selectedValues = appliedValues;
      if (this.mainFilter === 'pows') {
        //  let powSelectedValues = this.powsFilter.selectedValues;
        this.set('powsFilter.selectedValues', appliedValues);
      }

      if (this.onUpdate) {
        this.onUpdate();
      }
    },
    updateOrgSubFilters(e) {
      let { id } = e.target;
      let subFilters = this.orgFilter.subFilters;

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

      let appliedValues = _.map(appliedInputs, (input) => input.value);

      // update selectedValues on subFilters
      //
      // subFilters.selectedValues = appliedValues;
      this.set('orgFilter.subFilters.selectedValues', appliedValues);

      if (this.onUpdate) {
        this.onUpdate();
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

        if (this.onUpdate) {
          this.onUpdate();
        }
        return;
      }
      if (!isPropArray) {
        this.set(prop, val);
      } else {
        prop.addObject(val);
      }

      if (this.onUpdate) {
        this.onUpdate();
      }
    },
  },
});
