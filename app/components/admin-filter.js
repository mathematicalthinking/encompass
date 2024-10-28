import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

/**
<AdminFilter
	@mainOptions={{[{label, value}]}}
    @initialMainSelection={{string}} - the initial selection for the main filter
	@onUpdateMain={{fcn(value)}}
	@subOptions={{  { val1: {type: 'list', inputId, maxItems, ...} 
			{ val2: {type: 'checkbox', options: [{value, icon, label}, {value, icon, label, etc...]}
		}}
    @subOptionsSelections={{array}} - the current selections for the sub options (values)
	@onUpdateSub={{ if a list: fcn([the new full list])
                        if a checkbox: fcn(value, the new boolean state) }}

/>
 */

export default class AdminWorkspaceFilterComponent extends Component {
  @service('utility-methods') utils;
  @tracked dropdownSelections = [];

  get initialMainSelection() {
    return [this.args.mainOptions?.[0]?.value ?? null];
  }

  get hasCurrentSelections() {
    return this.dropdownSelections.length > 0;
  }

  @action
  updateMultiSelect(val, $item) {
    if (!val) return;

    const isRemoval = !$item;

    if (isRemoval) {
      this.dropdownSelections = this.dropdownSelections.filter(
        (item) => item !== val
      );
    } else {
      this.dropdownSelections = [...this.dropdownSelections, val];
    }
    if (this.args.onUpdateMain) {
      this.args.onUpdateSub(this.dropdownSelections);
    }
  }

  @action
  toggleSubOption(option) {
    if (this.args.onUpdateSub && this.args.subSelections) {
      this.args.onUpdateSub(
        !this.args.subSelections.includes(option.value),
        option.value
      );
    }
  }
}
