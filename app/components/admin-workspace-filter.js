import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import _ from 'underscore';
export default class AdminWorkspaceFilterComponent extends Component {
  @service('current-user') currentUser;
  @tracked secondaryFilter;

  @tracked('secondaryFilter.selectedValue') mainFilter;
  @tracked('mainFilter', 'org') showOrgFilter;
  @tracked('secondaryFilter.inputs.org') orgFilter;
  @tracked('secondaryFilter.inputs.org.subFilters.selectedValues')
  selectedOrgSubFilters;

  get orgFilterSubOptions() {
    return _.map(this.orgFilter.subFilters.inputs, (val, key) => val);
  }

  get areCurrentSelections() {
    return !_.isEmpty(this.selectedValues);
  }

  get currentSecondaryFilter() {
    let inputs = this.secondaryFilter.inputs;
    let mainFilter = this.mainFilter;
    return inputs[mainFilter];
  }

  get showUserFilter() {
    let val = this.mainFilter;
    return val === 'owner' || val === 'creator';
  }

  get selectedValues() {
    return this.currentSecondaryFilter.selectedValues;
  }

  get initialMainFilterItems() {
    let val = this.mainFilter;
    return [val];
  }

  clearSelectedValues() {
    this.currentSecondaryFilter.selectedValues = [];
  }

  @action
  setMainFilter(val) {
    if (!val) {
      return;
    }
    if (this.mainFilter !== 'pows') {
      this.clearSelectedValues();
    }
    this.mainFilter = val;
    this.onUpdate();
  }

  @action
  updateOrgSubFilters(e) {
    let { id } = e.target;
    let subFilters = this.orgFilter.subFilters;

    let targetInput = subFilters.inputs[id];
    if (!targetInput) {
      return;
    }
    targetInput.isApplied = !targetInput.isApplied;

    let appliedInputs = _.filter(subFilters.inputs, (input) => input.isApplied);
    let appliedValues = _.map(appliedInputs, (input) => input.value);

    this.orgFilter.subFilters.selectedValues = appliedValues;

    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  @action
  updateMultiSelect(val, $item, propToUpdate) {
    if (!val || !propToUpdate) {
      return;
    }
    let isRemoval = _.isNull($item);
    let prop = this[propToUpdate];
    let isPropArray = Array.isArray(prop);

    if (isRemoval) {
      if (!isPropArray) {
        this[propToUpdate] = null;
      } else {
        prop.removeObject(val);
      }
      if (this.onUpdate) {
        this.onUpdate();
      }
      return;
    }

    if (!isPropArray) {
      this[propToUpdate] = val;
    } else {
      prop.addObject(val);
    }

    if (this.onUpdate) {
      this.onUpdate();
    }
  }
}
