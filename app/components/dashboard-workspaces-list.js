import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class DashboardWorkspacesListComponent extends Component {
  @service('utility-method') utils;
  @service('sweet-alert') alert;
  isHidden = false;
  openMenu = false;
  toggleRoleErrors = [];
  isToggleError = false;
  @tracked sortCriterion = {
    name: 'A-Z',
    sortParam: { param: 'lastModifiedDate', direction: 'asc' },
    icon: 'fas fa-sort-alpha-down sort-icon',
    type: 'lastModifiedDate',
  };
  sortOptions = {
    name: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { param: 'name', direction: 'asc' },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'name',
      },
      {
        name: 'Z-A',
        sortParam: { param: 'name', direction: 'desc' },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'name',
      },
    ],
    classes: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: {
          param: 'linkedAssignment.section.name',
          direction: 'asc',
        },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'classes',
      },
      {
        name: 'Z-A',
        sortParam: {
          param: 'linkedAssignment.section.name',
          direction: 'desc',
        },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'classes',
      },
    ],
    assignedDate: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: {
          param: 'linkedAssignment.assignedDate',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'assignedDate',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'linkedAssignment.assignedDate',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'assignedDate',
      },
    ],
    dueDate: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: {
          param: 'linkedAssignment.dueDate',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'dueDate',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'linkedAssignment.dueDate',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'dueDate',
      },
    ],
    submissions: [
      { sortParam: null, icon: '' },
      {
        name: 'Newest',
        sortParam: {
          param: 'submissionsLength',
          direction: 'asc',
        },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'submissions',
      },
      {
        name: 'Oldest',
        sortParam: {
          param: 'submissionsLength',
          direction: 'desc',
        },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'submissions',
      },
    ],
    owner: [
      { sortParam: null, icon: '' },
      {
        name: 'A-Z',
        sortParam: { param: 'owner.username', direction: 'asc' },
        icon: 'fas fa-sort-alpha-down sort-icon',
        type: 'owner',
      },
      {
        name: 'Z-A',
        sortParam: { param: 'owner.username', direction: 'desc' },
        icon: 'fas fa-sort-alpha-up sort-icon',
        type: 'owner',
      },
    ],
    lastModifiedDate: [
      { sortParam: null, icon: '' },
      {
        id: 3,
        name: 'Newest',
        sortParam: { param: 'lastModifiedDate', direction: 'asc' },
        icon: 'fas fa-arrow-down sort-icon',
        type: 'lastModifiedDate',
      },
      {
        id: 4,
        name: 'Oldest',
        sortParam: { param: 'lastModifiedDate', direction: 'desc' },
        icon: 'fas fa-arrow-up sort-icon',
        type: 'lastModifiedDate',
      },
    ],
  };
  get sortedWorkspaces() {
    let sortValue = this.sortCriterion.sortParam.param || 'lastModifiedDate';
    let sortDirection = this.sortCriterion.sortParam.direction || 'asc';
    let sorted;
    if (this.args.workspaces) {
      sorted = this.args.workspaces.sortBy(sortValue);
    }
    if (sortDirection === 'desc') {
      return sorted.reverse();
    }
    return this.args.workspaces;
  }
  @action
  updateSortCriterion(criterion) {
    this.sortCriterion = criterion;
  }
  @action
  showToggleModal() {
    this.alert
      .showModal(
        'question',
        'Are you sure you want to switch roles?',
        'If you are currently modifying or creating a new record, you will lose all unsaved progress',
        'Ok'
      )
      .then((result) => {
        if (result.value) {
          this.toggleActingRole();
        }
      });
  }
  @action
  toggleActingRole() {
    // should this action be moved to the application controller?
    const currentUser = this.args.user;

    // student account types cannot toggle to teacher role
    if (currentUser.get('accountType') === 'S') {
      return;
    }
    const actingRole = currentUser.get('actingRole');
    if (actingRole === 'teacher') {
      currentUser.set('actingRole', 'student');
    } else {
      currentUser.set('actingRole', 'teacher');
    }
    currentUser
      .save()
      .then(() => {
        this.actionToConfirm = null;
        this.store.unloadAll('assignment');
        // window location needed to request dashboard data, cannot transitionTo('toHome')
        window.location.href = '/';
        this.alert.showToast(
          'success',
          'Successfully switched roles',
          'bottom-end',
          2500,
          false,
          null
        );
      })
      .catch(() => {
        // handle error
        //TODO FIX errorHandlingMixin
        // this.handleErrors(err, 'toggleRoleErrors', currentUser);
        this.isToggleError = true;
        // send error up to application level to handle?
      });
  }
}
