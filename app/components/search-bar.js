import Component from '@glimmer/component';
import { action } from '@ember/object';
import debounce from 'lodash-es/debounce';

export default class SearchBarComponent extends Component {
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

  get queryErrors() {
    return this.args.queryErrors || [];
  }

  get showClear() {
    return this.args.inputValue;
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
    this.initiateSearch(this.inputStringValue);
  }

  @action
  clearResults() {
    this.args.clearSearchResults?.();
  }

  @action
  clearErrors() {
    this.args.clearErrors?.();
  }

  @action
  searchAction() {
    this.initiateSearch(this.inputStringValue);
  }

  @action
  onInputChange() {
    if (this.args.doSearchOnInputChange) {
      if (this.debouncedSearch) {
        return this.debouncedSearch();
      }
      this.onChangeSearch();
    }
  }
}
