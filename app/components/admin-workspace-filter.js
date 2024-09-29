import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AdminWorkspaceFilterComponent extends Component {
  @tracked mainFilter = this.args.secondaryFilter?.selectedValue ?? '';
  @tracked selectedOrgSubFilters =
    this.args.secondaryFilter?.inputs?.org?.subFilters?.selectedValues ?? [];
  @tracked orgFilter = this.args.secondaryFilter?.inputs?.org;

  get showOrgFilter() {
    return this.mainFilter === 'org';
  }

  get orgFilterSubOptions() {
    return Object.values(this.orgFilter?.subFilters?.inputs ?? {});
  }

  get areCurrentSelections() {
    return this.selectedValues.length > 0;
  }

  get currentSecondaryFilter() {
    const inputs = this.args.secondaryFilter?.inputs ?? {};
    return inputs[this.mainFilter];
  }

  get showUserFilter() {
    return this.mainFilter === 'owner' || this.mainFilter === 'creator';
  }

  get selectedValues() {
    return this.currentSecondaryFilter?.selectedValues ?? [];
  }

  get initialMainFilterItems() {
    return [this.mainFilter];
  }

  @action
  setMainFilter(val) {
    if (!val) return;

    if (this.mainFilter !== 'pows') {
      this.clearSelectedValues();
    }

    this.mainFilter = val;

    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  updateOrgSubFilters(event) {
    const id = event.target.id;
    const targetInput = this.orgFilter?.subFilters?.inputs?.[id];

    // not a valid option
    if (!targetInput) return;

    // valid option, toggle the inputs isApplied value
    targetInput.isApplied = !targetInput.isApplied;

    // filter for inputs who are currently applied
    const appliedInputs = Object.values(
      this.orgFilter.subFilters.inputs
    ).filter((input) => input.isApplied);
    const appliedValues = appliedInputs.map((input) => input.value);

    // update selectedValues on subFilters
    this.orgFilter.subFilters.selectedValues = appliedValues;

    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  updateMultiSelect(val, $item, propToUpdate) {
    if (!val || !propToUpdate) return;

    const isRemoval = !$item;
    const prop = this[propToUpdate];

    if (isRemoval) {
      if (Array.isArray(prop)) {
        this[propToUpdate] = prop.filter((item) => item !== val);
      } else {
        this[propToUpdate] = null;
      }
    } else {
      if (Array.isArray(prop)) {
        this[propToUpdate] = [...prop, val];
      } else {
        this[propToUpdate] = val;
      }
    }

    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  clearSelectedValues() {
    const currentSecondaryFilter = this.currentSecondaryFilter;
    if (currentSecondaryFilter) {
      currentSecondaryFilter.selectedValues = [];
    }
  }

  isIncludedInSubFilters(val) {
    return this.selectedOrgSubFilters.includes(val);
  }
}
