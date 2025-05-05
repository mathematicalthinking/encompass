// app/components/ui/typeahead.js

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from 'lodash-es';

export default class UiTypeaheadComponent extends Component {
  @tracked query = '';
  @tracked isOpen = false;

  debouncedCloseDropdown = debounce(() => {
    this.isOpen = false;
  }, 200);

  get placeholder() {
    return this.args.placeholder || '';
  }

  get minLength() {
    return this.args.minLength ?? 1;
  }

  get optionLabelPath() {
    return this.args.optionLabelPath || 'id';
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
    this.query = event.target.value;
    this.isOpen = true;
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
}
