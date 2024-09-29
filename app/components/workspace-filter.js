import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class WorkspaceFilterComponent extends Component {
  @service currentUser;

  @tracked closedMenu = true;
  @tracked showMoreFilters = false;
  @tracked toggleTrashed = false;
  @tracked toggleHidden = false;

  get primaryFilterValue() {
    return this.args.primaryFilter?.value;
  }

  get userIsAdmin() {
    return this.currentUser.user.isAdmin;
  }

  get primaryFilterInputs() {
    return this.args.filter?.primaryFilters?.inputs ?? {};
  }

  get secondaryFilter() {
    return this.args.primaryFilter?.secondaryFilters ?? {};
  }

  get showAdminFilters() {
    return this.primaryFilterValue === 'all';
  }

  get adminFilter() {
    return this.args.filter?.primaryFilters?.inputs?.all ?? {};
  }

  get currentValues() {
    return this.secondaryFilter?.selectedValues ?? [];
  }

  get orgOptions() {
    return (
      this.args.orgs?.map((org) => ({
        id: org.id,
        name: org.name,
      })) ?? []
    );
  }

  get primaryFilterOptions() {
    return Object.values(this.primaryFilterInputs).sort(
      (a, b) => a.order - b.order
    );
  }

  get secondaryFilterOptions() {
    return Object.values(this.secondaryFilter.inputs ?? {});
  }

  @action
  updateTopLevel(val) {
    // need to set filter[val] : true
    // but also need to make sure the current selected item is now false
    if (this.primaryFilterValue !== val) {
      let newPrimaryFilter = this.primaryFilterInputs?.[val] ?? {};

      // Call the onUpdate action passed down from the parent (workspace-list-container)
      if (this.args.onUpdate) {
        this.args.onUpdate(newPrimaryFilter);
      }
    }
  }

  @action
  updateSecondLevel(event) {
    let id = event.target.id;
    let targetInput = this.secondaryFilter?.inputs?.[id];
    if (!targetInput) {
      return;
    }
    targetInput.isApplied = !targetInput.isApplied;

    let appliedInputs = Object.values(this.secondaryFilter.inputs ?? {}).filter(
      (input) => input.isApplied
    );

    const appliedValues = appliedInputs.map((input) => input.value);

    if (this.args.onUpdate) {
      this.args.onUpdateSecondary(appliedValues);
    }
  }

  @action
  onUpdate() {
    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  toggleMoreFilters() {
    this.showMoreFilters = !this.showMoreFilters;
    this.closedMenu = !this.closedMenu;
  }

  @action
  toggleTrashedWorkspaces() {
    this.toggleTrashed = !this.toggleTrashed;
    if (this.args.triggerShowTrashed) {
      this.args.triggerShowTrashed();
    }
  }

  @action
  toggleHiddenWorkspaces() {
    this.toggleHidden = !this.toggleHidden;
    if (this.args.triggerShowHidden) {
      this.args.triggerShowHidden();
    }
  }
}
