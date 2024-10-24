import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
/**
 * <AdminWorkspaceFilter
 *  @mainOptions={{object}}
 *  @subFilterConfig={{object}} - subfilters that are available for the main selection
 *  @subFilterWhenSelections={{object}} - subfilters that show when a selection is made from the dropdown
 *  @onUpdateMain={{function(object key)}}
 *  @onUpdateSubFilter={{function(array of object keys)}}
 * />
 */

export default class AdminWorkspaceFilterComponent extends Component {
  @service('utility-methods') utils;
  @tracked mainSelectionConfig = this.args.mainOptions[0];
  @tracked dropdownSelections = [];
  @tracked subFilterSelections = [];

  constructor() {
    super(...arguments);

    const subFilterConfig = this.args.subFilterConfig ?? {};
    const subFilterWhenSelections = this.args.subFilterWhenSelections ?? {};

    this.subFilterSelections = [
      ...this.extractSubFilterKeys(subFilterConfig),
      ...this.extractSubFilterKeys(subFilterWhenSelections),
    ];
  }

  get showSelectionBasedSubFilter() {
    return (
      this.hasCurrentSelections &&
      !this.utils.isNullOrUndefined(
        this.subFilterWhenSelections?.[this.mainSelection]
      )
    );
  }

  get showOrgFilter() {
    return this.mainSelection === 'org';
  }

  get showPowsFilter() {
    return this.mainSelection === 'pows';
  }

  get showSubFilter() {
    return !this.utils.isNullOrUndefined(
      this.args.subFilterConfig?.[this.mainSelection]
    );
  }

  get showUserFilter() {
    return this.mainSelection === 'owner' || this.mainSelection === 'creator';
  }

  get initialMainFilterItem() {
    return [this.mainSelectionConfig.value];
  }

  get hasCurrentSelections() {
    return this.dropdownSelections.length > 0;
  }

  get mainSelection() {
    return this.mainSelectionConfig.value;
  }

  get selectionBasedSubOptions() {
    return Object.values(
      this.args.subFilterWhenSelections?.[this.mainSelection] ?? {}
    );
  }

  get generalSubOptions() {
    return Object.values(this.args.subFilterConfig?.[this.mainSelection] ?? {});
  }

  @action
  setMainSelection(val) {
    const newOption = this.args.mainOptions.find((opt) => opt.value === val);

    if (!newOption) return;

    this.mainSelectionConfig = newOption;
    if (this.args.onUpdateMain) {
      // this.args.onUpdateMain(newOption);
    }

    this.clearSelectionBasedSelectedValues();
  }

  updateSubFilters(id, filterConfig) {
    if (!Object.keys(filterConfig?.[this.mainSelection] ?? []).includes(id)) {
      return;
    }

    const index = this.subFilterSelections.indexOf(id);
    if (index === -1) {
      this.subFilterSelections = [...this.subFilterSelections, id];
    } else {
      this.subFilterSelections = this.subFilterSelections.filter(
        (item) => item !== id
      );
    }
    if (this.args.onUpdateSubFilter) {
      this.args.onUpdateSubFilter(this.subFilterSelections);
    }
  }

  @action
  updateSelectionBasedSubFilters(event) {
    const id = event.target.id;
    this.updateSubFilters(id, this.args.subFilterWhenSelections);
  }

  @action
  updateGeneralSubFilters(event) {
    const id = event.target.id;
    this.updateSubFilters(id, this.args.subFilterConfig);
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
    // need to figure out updating
    console.log('dropdown selections', this.dropdownSelections);
  }

  clearSelectionBasedSelectedValues() {
    // remove from subfilter selections only those values that are selection based. Leave the selections for general subfilters as the user selected
    const selectionBasedOptions = this.extractSubFilterKeys(
      this.args.subFilterWhenSelections ?? {}
    );
    this.subFilterSelections = this.subFilterSelections.filter(
      (item) => !selectionBasedOptions.includes(item)
    );
    this.dropdownSelections = [];
  }

  extractSubFilterKeys(filterObj) {
    return Object.values(filterObj).reduce(
      (keys, subObj) => keys.concat(Object.keys(subObj)),
      []
    );
  }
}
