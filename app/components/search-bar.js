import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import debounce from 'lodash-es/debounce';
import validate from 'validate.js';

export default class SearchBarComponent extends Component {
  @tracked queryErrors = null;

  defaultConstraints = {
    query: {
      length: {
        minimum: 1,
        maximum: 500,
      },
    },
  };

  constructor() {
    super(...arguments);

    const doDebounce = this.args.doDebounce || false;
    const debounceTime = this.args.debounceTime || 300;
    if (doDebounce) {
      this.debouncedSearch = debounce(
        this.onChangeSearch.bind(this),
        debounceTime
      );
    }
  }

  get showClear() {
    return (
      this.args.searchQuery ||
      this.args.searchInputValue ||
      (this.args.doSearchOnInputChange && this.args.inputValue)
    );
  }

  get placeholder() {
    const base = this.args.basePlaceholder;
    if (!this.args.showFilter) {
      return base;
    }
    const criterion = this.args.selectedCriterion;
    return `${base} by ${criterion}`;
  }

  get inputStringValue() {
    const val = this.args.inputValue;
    if (!val) {
      return '';
    }
    const trimmed = val.trim();
    return trimmed.toLowerCase();
  }

  get inputConstraints() {
    return this.args.constraints || this.defaultConstraints;
  }

  initiateSearch(val) {
    const criterion = this.args.selectedCriterion;
    this.args.onSearch?.(val, criterion);
  }

  onChangeSearch() {
    this.validate();
  }

  @action
  clearResults() {
    this.args.clearSearchResults?.();
  }

  @action
  validate() {
    const val = this.inputStringValue;
    const values = { query: val };
    const constraints = this.inputConstraints;

    const errors = validate(values, constraints);
    if (errors) {
      for (let key of Object.keys(errors)) {
        const errorProp = `${key}Errors`;
        this[errorProp] = errors[key];
      }
      return;
    }
    this.initiateSearch(val);
  }

  @action
  clearErrors() {
    if (this.queryErrors) {
      this.queryErrors = null;
    }
  }

  @action
  searchAction() {
    this.validate();
  }

  @action
  onInputChange() {
    if (this.args.doSearchOnInputChange) {
      if (this.debouncedSearch) {
        return this.debouncedSearch();
      }
      this.validate();
    }
  }
}
