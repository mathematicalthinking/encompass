import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
 * <WorkspaceFilter
        @mainOptions={{this.mainOptions}}
        @mainSelection={{this.mainSelection}}
        @onUpdateMain={{this.handleUpdateMain}}
        @subOptions={{this.subOptions}}
        @subSelections={{this.subSelections}}
        @onUpdateSub={{this.handleUpdateSub}}
        @showTrashed={{this.toggleTrashed}}
        @showHidden={{this.toggleHidden}}
        @toggleTrashed={{this.triggerShowTrashed}}
        @toggleHidden={{this.triggerShowHidden}}
      >
 */

export default class WorkspaceFilterComponent extends Component {
  @service currentUser;

  @tracked closedMenu = true;
  @tracked showMoreFilters = false;

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
  toggleTrashedWorkspaces() {
    if (this.args.triggerShowTrashed) {
      this.args.triggerShowTrashed();
    }
  }

  @action
  toggleHiddenWorkspaces() {
    if (this.args.triggerShowHidden) {
      this.args.triggerShowHidden();
    }
  }
}
