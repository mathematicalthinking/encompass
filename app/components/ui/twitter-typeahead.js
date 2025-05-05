import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import debounce from 'lodash-es/debounce';

export default class UiTypeaheadComponent extends Component {
  @tracked query = '';
  @tracked isOpen = false;
  @tracked highlightedIndex = -1;

  debouncedCloseDropdown = debounce(() => {
    this.isOpen = false;
  }, 200);

  get placeholder() {
    return this.args.placeholder || '';
  }

  get minLength() {
    return this.args.minLength ?? 1;
  }

  get filteredList() {
    const dataList = this.args.dataList || [];
    const query = this.query.trim().toLowerCase();

    if (query.length < this.minLength) {
      return [];
    }

    return dataList
      .map((item) => ({
        item,
        label: this.getItemLabel(item),
      }))
      .filter(({ label }) => label?.toLowerCase().includes(query));
  }

  get hasResults() {
    return this.isOpen && this.filteredList.length > 0;
  }

  getItemLabel(item) {
    const path = this.args.optionLabelPath || 'id';
    return typeof item.get === 'function' ? item.get(path) : item[path];
  }

  @action
  updateQuery(event) {
    const value = event.target.value;
    this.query = value;
    this.highlightedIndex = -1;
    this.isOpen = true;

    if (
      this.args.setSelectedValueOnChange &&
      typeof this.args.onSelect === 'function'
    ) {
      this.args.onSelect(value);
    }
  }

  @action
  selectItem(entry) {
    const item = entry.item;
    if (this.args.onSelect) {
      this.args.onSelect(item);
    }

    if (this.args.allowMultiple) {
      this.query = '';
      this.isOpen = false;
    } else {
      this.query = entry.label || '';
      this.isOpen = false;
    }
  }

  @action
  handleBlur() {
    this.debouncedCloseDropdown();
  }

  @action
  handleKeydown(event) {
    if (!this.hasResults) return;

    const maxIndex = this.filteredList.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.highlightedIndex = Math.min(this.highlightedIndex + 1, maxIndex);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.highlightedIndex = Math.max(this.highlightedIndex - 1, 0);
    } else if (event.key === 'Enter' && this.highlightedIndex >= 0) {
      event.preventDefault();
      this.selectItem(this.filteredList[this.highlightedIndex]);
    }
  }
}
