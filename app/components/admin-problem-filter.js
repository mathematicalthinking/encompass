import Component from '@glimmer/component';
import { action, get } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { A } from '@ember/array';

export default class AdminProblemFilterComponent extends Component {
  @tracked('args.secondaryFilter.selectedValue') mainFilter;
  @tracked('mainFilter', 'org') showOrgFilter;
  @tracked('mainFilter', 'pows') showPowsFilter;
  @tracked('args.secondaryFilter.inputs.pows') powsFilter;
  @tracked('args.secondaryFilter.inputs.org') orgFilter;
  @tracked('args.secondaryFilter.inputs.org.subFilters.selectedValues')
  @tracked
  selectedOrgSubFilters;
  @tracked selectedValues = this.currentSecondaryFilter?.selectedValues ?? [];

  get orgFilterSubOptions() {
    return this.orgFilter?.subFilters?.inputs.map((val) => val) ?? [];
  }

  get areCurrentSelections() {
    return this.selectedValues.length > 0;
  }

  get currentSecondaryFilter() {
    let inputs = this.args.secondaryFilter?.inputs;
    let mainFilter = this.mainFilter;
    return inputs ? inputs[mainFilter] : null;
  }

  get powsFilterOptions() {
    return this.powsFilter?.secondaryFilters?.inputs.map((val) => val) ?? [];
  }

  get showUserFilter() {
    let val = this.mainFilter;
    return val === 'author' || val === 'creator';
  }

  get initialMainFilterItems() {
    let val = this.mainFilter;
    return [val];
  }
  constructor(...args) {
    super(...args);
    this.mainFilter = this.args.mainFilter;
  }
  // Is this still needed?
  // willDestroy() {
  //   if (this.mainFilter !== 'pows') {
  //     this.clearSelectedValues();
  //   }
  //   super.willDestroyElement(...arguments);
  // }

  @action
  clearSelectedValues() {
    if (this.currentSecondaryFilter) {
      this.currentSecondaryFilter.selectedValues = [];
    }
  }

  @action
  setMainFilter(val) {
    if (!val) {
      return;
    }
    // clear state unless current filter is pows
    if (this.mainFilter !== 'pows') {
      this.clearSelectedValues();
    }
    this.mainFilter = val;
    this.args.onUpdate();
  }

  @action
  updateSecondLevel(e) {
    let { id } = e.target;
    let secondaryFilter = this.powsFilter?.secondaryFilters;

    let targetInput = secondaryFilter?.inputs[id];
    if (!targetInput) {
      // not a valid option
      return;
    }
    // valid option, toggle the inputs isApplied value
    targetInput.isApplied = !targetInput.isApplied;

    // filter for inputs who are currently applied
    let appliedInputs = secondaryFilter.inputs.filter(
      (input) => input.isApplied
    );

    let appliedValues = appliedInputs.map((input) => input.value);

    // update selectedValues on secondaryFilter
    secondaryFilter.selectedValues = appliedValues;
    if (this.mainFilter === 'pows') {
      this.powsFilter.selectedValues = appliedValues;
    }

    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  updateOrgSubFilters(e) {
    let { id } = e.target;
    let subFilters = this.orgFilter?.subFilters;

    let targetInput = subFilters?.inputs[id];
    if (!targetInput) {
      // not a valid option
      return;
    }
    // valid option, toggle the inputs isApplied value
    targetInput.isApplied = !targetInput.isApplied;

    // filter for inputs who are currently applied
    let appliedInputs = subFilters.inputs.filter((input) => input.isApplied);

    let appliedValues = appliedInputs.map((input) => input.value);

    // update selectedValues on subFilters
    this.orgFilter.subFilters.selectedValues = appliedValues;

    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  updateMultiSelect(val, $item, propToUpdate) {
    if (!val || !propToUpdate) {
      return;
    }
    let isRemoval = $item === null;
    let prop = this[propToUpdate];
    let isPropArray = Array.isArray(prop);

    if (isRemoval) {
      if (!isPropArray) {
        this[propToUpdate] = null;
      } else {
        A(prop).removeObject(val);
      }

      if (this.args.onUpdate) {
        this.args.onUpdate();
      }
      return;
    }
    if (!isPropArray) {
      this[propToUpdate] = val;
    } else {
      A(prop).addObject(val);
    }

    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }
}
