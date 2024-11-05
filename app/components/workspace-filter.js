import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

/**
      <WorkspaceFilter
        @filterName={{this.filterName}}
        @adminFilterName={{this.adminFilterName}}
        @onUpdate={{this.triggerFetch}}
        @showTrashed={{this.toggleTrashed}}
        @showHidden={{this.toggleHidden}}
        @toggleTrashed={{this.triggerShowTrashed}}
        @toggleHidden={{this.triggerShowHidden}}
      />
 */

export default class WorkspaceFilterComponent extends Component {
  @service currentUser;

  @tracked closedMenu = true;
  @tracked showMoreFilters = false;

  get userIsAdmin() {
    return this.currentUser.user.isAdmin;
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
