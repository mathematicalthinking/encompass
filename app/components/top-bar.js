import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TopBarComponent extends Component {
  @service errorHandling;
  @service('sweet-alert') alert;
  @service('current-user') currentUserService;
  @service store;

  @tracked isOpen = false;
  @tracked isToggleError = false;
  drawerElement = null;

  constructor() {
    super(...arguments);
    // Bind the click outside handler as an action for easy teardown and to access class properties
    document.addEventListener('click', this.handleClickOutside);
  }

  willDestroy() {
    super.willDestroy(...arguments);
    document.removeEventListener('click', this.handleClickOutside);
  }

  get toggleRoleErrors() {
    return this.errorHandling.getErrors('toggleRoleErrors') || [];
  }

  get currentUser() {
    return this.currentUserService.user;
  }

  get isStudentAccount() {
    return this.currentUser && this.currentUser.accountType === 'S';
  }

  @action
  setDrawerElement(element) {
    this.drawerElement = element;
  }

  // Handle clicks outside the component to close the hamburger menu
  @action
  handleClickOutside(event) {
    if (this.isOpen && !this.drawerElement?.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // Toggle the drawer open or closed
  @action
  toggleDrawer() {
    this.isOpen = !this.isOpen;
  }

  // Show confirmation modal before toggling roles
  @action
  async showToggleModal() {
    const result = await this.alert.showModal(
      'question',
      'Are you sure you want to switch roles?',
      'If you are currently modifying or creating a new record, you will lose all unsaved progress',
      'Ok'
    );

    if (result.value) {
      this.toggleActingRole();
    }
  }

  // Toggle between teacher and student roles
  @action
  async toggleActingRole() {
    if (this.currentUser.accountType === 'S') {
      return;
    }

    const currentUser = this.currentUser;
    const newRole =
      currentUser.actingRole === 'teacher' ? 'student' : 'teacher';

    try {
      this.errorHandling.removeMessages('toggleRoleErrors');
      currentUser.actingRole = newRole;
      await currentUser.save();

      this.store.unloadAll('assignment');
      if (this.args.toHome) this.args.toHome();

      this.alert.showToast(
        'success',
        'Successfully switched roles',
        'bottom-end',
        2500,
        false,
        null
      );
    } catch (err) {
      this.errorHandling.handleErrors(err, 'toggleRoleErrors', currentUser);
      this.isToggleError = true;
    }
  }
}
