import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import debounce from 'lodash-es/debounce';
import validate from 'validate.js';

export default Component.extend({
  classNames: ['search-bar-comp'],
  searchQuery: alias('parentView.searchQuery'),
  searchInputValue: alias('parentView.searchInputValue'),
  defaultConstraints: {
    query: {
      length: {
        minimum: 1,
        maximum: 500,
      },
    },
  },

  init() {
    this._super(...arguments);

    let doDebounce = this.doDebounce || false;
    let debounceTime = this.debounceTime || 300;
    if (doDebounce) {
      this.set('debouncedSearch', debounce(this.onChangeSearch, debounceTime));
    }
  },

  showClear: computed(
    'searchQuery',
    'searchInputValue',
    'doSearchOnInputChange',
    'inputValue',
    function () {
      let hasSearchQuery = this.searchQuery;
      let hasSearchInputValue = this.searchInputValue;

      if (
        hasSearchQuery ||
        hasSearchInputValue ||
        (this.doSearchOnInputChange && this.inputValue)
      ) {
        return true;
      } else {
        return false;
      }
    }
  ),

  placeholder: computed(
    'basePlaceholder',
    'selectedCriterion',
    'showFilter',
    function () {
      let base = this.basePlaceholder;
      if (!this.showFilter) {
        return base;
      }
      let criterion = this.selectedCriterion;
      let combined = `${base} by ${criterion}`;
      return combined;
    }
  ),

  inputStringValue: computed('inputValue', 'queryErrors', function () {
    let val = this.inputValue;
    if (!val) {
      return '';
    }
    // handle escaping?
    let trimmed = val.trim();
    let lowercase = trimmed.toLowerCase();
    if (this.queryErrors) {
      this.set('queryErrors', null);
    }
    return lowercase;
  }),

  inputConstraints: computed('constraints', 'defaultConstraints', function () {
    let constraints = this.constraints;
    if (constraints) {
      return constraints;
    }
    return this.defaultConstraints;
  }),

  initiateSearch: function (val) {
    let criterion = this.selectedCriterion;
    this.onSearch(val, criterion);
  },

  onChangeSearch: function () {
    this.send('validate');
  },

  actions: {
    clearResults: function () {
      this.set('inputValue', null);
      this.clearSearchResults();
    },

    validate: function () {
      let val = this.inputStringValue;
      let values = { query: val };
      let constraints = this.inputConstraints;

      let errors = validate(values, constraints);
      if (errors) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }
      // handle validation success
      this.initiateSearch(val);
    },
    clearErrors: function () {
      if (this.queryErrors) {
        this.set('queryErrors', null);
      }
    },
    searchAction: function () {
      this.send('validate');
    },
    onInputChange() {
      if (this.doSearchOnInputChange) {
        if (this.debouncedSearch) {
          return this.debouncedSearch();
        }
        this.send('validate');
      }
    },
  },
});
