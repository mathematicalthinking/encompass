import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 *     <ProblemFilter
        @mainOptions={{this.mainOptions}}
        @mainSelection={{this.mainSelection}}
        @onUpdateMain={{this.handleUpdateMain}}
        @subOptions={{this.subOptions}}
        @subSelections={{this.subSelections}}
        @onUpdateSub={{this.handleUpdateSub}}
        @showTrashed={{this.toggleTrashed}}
        @toggleTrashed={{this.triggerShowTrashed}}
        @categoriesFilter={{this.categoriesFilter}}
        @onUpdateCategories={{this.handleUpdateCategories}}
      >
 */
export default class ProblemFilterComponent extends Component {
  @service currentUser;
  @service store;

  @tracked closedMenu = true;
  @tracked showMoreFilters = false;
  @tracked showCategoryFilters = false;

  get userIsAdmin() {
    return this.currentUser.user.isAdmin;
  }

  get showAdminFilters() {
    return this.args.mainSelection.value === 'all';
  }

  @action
  updateTopLevel(val) {
    if (this.args.onUpdateMain) {
      this.args.onUpdateMain(val.value);
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

  @action
  toggleMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
    this.closedMenu = !this.closedMenu;
  }

  @action
  toggleTrashedProblems() {
    if (this.args.triggerShowTrashed) {
      this.args.triggerShowTrashed();
    }
  }

  @action
  toggleCategoryFilters() {
    this.showCategoryFilters = !this.showCategoryFilters;
  }

  @action
  addCategory(val) {
    if (!val) {
      return;
    }
    let category = this.args.store.peekRecord('category', val);
    if (category) {
      this.args.categoriesFilter.addObject(category);
    }
  }

  @action
  removeCategory(category) {
    this.args.categoriesFilter.removeObject(category);
  }

  @action
  toggleIncludeSubCats() {
    this.args.onUpdate();
  }
}
