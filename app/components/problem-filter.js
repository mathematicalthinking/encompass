import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { alias, equal, reads } from '@ember/object/computed';
// attrs passed in by parent
// store
// onUpdate
// primaryFilter
// orgs
/*global _:false */
import { isEqual } from '@ember/utils';
// import CategoriesListMixin from '../mixins/categories_list_mixin';

export default Component.extend({
  elementId: 'problem-filter',
  currentUser: service('current-user'),
  primaryFilterValue: alias('primaryFilter.value'),
  primaryFilterInputs: alias('filter.primaryFilters.inputs'),
  secondaryFilter: alias('primaryFilter.secondaryFilters'),
  showAdminFilters: equal('primaryFilter.value', 'all'),
  adminFilter: alias('filter.primaryFilters.inputs.all'),
  showCategoryFilters: false,
  showMoreFilters: false,
  closedMenu: true,

  init: function () {
    this._super(...arguments);
    this.set('categoriesFilter', this.selectedCategories);
  },
  // current subFilter selected values
  currentValues: reads('secondaryFilter.selectedValues'),

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
    return _.sortBy(mapped, 'label');
  }),

  secondaryFilterOptions: computed(
    'primaryFilter.secondaryFilters.inputs',
    function () {
      return _.map(
        this.get('primaryFilter.secondaryFilters.inputs'),
        (val, key) => {
          return val;
        }
      );
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

    toggleCategoryFilters() {
      this.set('showCategoryFilters', !this.showCategoryFilters);
    },

    toggleMoreFilters() {
      this.set('showMoreFilters', !this.showMoreFilters);
      this.set('closedMenu', !this.closedMenu);
    },

    toggleTrashedProblems() {
      this.set('toggleTrashed', !this.toggleTrashed);
      this.triggerShowTrashed();
    },

    showCategoryMenu() {
      this.store.query('category', {}).then((queryCats) => {
        let categories = queryCats.get('meta');
        this.set('categoryTree', categories.categories);
        this.set('showCategoryList', true)
      });
    },

    addCategorySelectize(val, $item) {
      if (!val) {
        return;
      }

      let peeked = this.store.peekAll('category');
      let cat = peeked.findBy('id', val);
      this.categoriesFilter.addObject(cat);

      // clear input
      this.$('select#categories-filter')[0].selectize.clear();
    },

    removeCategory(category) {
      this.categoriesFilter.removeObject(category);
    },

    toggleIncludeSubCats() {
      // toggle value
      let doInclude = this.doIncludeSubCategories;
      this.set('doIncludeSubCategories', !doInclude);

      let filter = this.categoriesFilter;
      // fetch problems if category filter isnt empty
      if (!_.isEmpty(filter)) {
        this.onUpdate();
      }
    },
  },
});
