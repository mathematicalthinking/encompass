import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias, equal } from '@ember/object/computed';
/*global _:false */
import { isEqual } from '@ember/utils';

export default Component.extend({
  elementId: 'workspace-filter',
  primaryFilterValue: alias('primaryFilter.value'),
  primaryFilterInputs: alias('filter.primaryFilters.inputs'),
  secondaryFilter: alias('primaryFilter.secondaryFilters'),
  showAdminFilters: equal('primaryFilter.value', 'all'),
  adminFilter: alias('filter.primaryFilters.inputs.all'),
  closedMenu: true,
  currentValues: computed.reads('secondaryFilter.selectedValues'),

  // used for populating the selectize instance
  // orgs passed in from parent are all orgs from db
  orgOptions: computed('orgs.[]', function () {
    let orgs = this.orgs;
    let toArray = orgs.toArray();
    let mapped = _.map(toArray, (org) => {
      return {
        id: org.id,
        name: org.get('name'),
      };
    });
    return mapped;
  }),

  primaryFilterOptions: computed('filter', 'primaryFilterInputs', function () {
    let mapped = _.map(this.primaryFilterInputs, (val, key) => {
      return val;
    });
    return _.sortBy(mapped, 'order');
  }),

  secondaryFilterOptions: computed(
    'primaryFilter.secondaryFilters.inputs',
    function () {
      return _.map(this.primaryFilter.secondaryFilters.inputs, (val, key) => {
        return val;
      });
    }
  ),

  actions: {
    updateTopLevel(val) {
      // need to set filter[val] : true
      // but also need to make sure the current selected item is now false
      let currentValue = this.primaryFilterValue;
      if (!isEqual(currentValue, val)) {
        let newPrimaryFilter = this.primaryFilterInputs[val];
        this.set('primaryFilter', newPrimaryFilter);
        if (this.onUpdate) {
          this.onUpdate();
        }
      }
    },
    updateSecondLevel(e) {
      let { id } = e.target;
      let secondaryFilter = this.secondaryFilter;

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

      this.set('secondaryFilter.selectedValues', appliedValues);

      if (this.onUpdate) {
        this.onUpdate();
      }
    },

    onUpdate() {
      this.onUpdate();
    },

    toggleMoreFilters() {
      this.set('showMoreFilters', !this.showMoreFilters);
      this.set('closedMenu', !this.closedMenu);
    },

    toggleTrashedWorkspaces() {
      this.set('toggleTrashed', !this.toggleTrashed);
      this.triggerShowTrashed();
    },

    toggleHiddenWorkspaces() {
      this.set('toggleHidden', !this.toggleHidden);
      this.triggerShowHidden();
    },
  },
});
