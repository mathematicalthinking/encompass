import Component from '@ember/component';
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(ErrorHandlingMixin, CurrentUserMixin, {
  tagName: 'header',
  elementId: 'al_header',
  toggleRoleErrors: [],
  alert: service('sweet-alert'),
  toggleRoleErrors: [],
  open: false,

  didReceiveAttrs: function () {
    let currentUser = this.currentUser;
    if (currentUser) {
      this.set('isStudentAccount', currentUser.get('accountType') === 'S');
    }
  },

  actions: {
    toggleDrawer: function () {
      this.set('open', !this.open);
    },
    showToggleModal: function () {
      this.alert
        .showModal(
          'question',
          'Are you sure you want to switch roles?',
          'If you are currently modifying or creating a new record, you will lose all unsaved progress',
          'Ok'
        )
        .then((result) => {
          if (result.value) {
            this.send('toggleActingRole');
          }
        });
    },

    toggleActingRole: function () {
      // should this action be moved to the application controller?
      const currentUser = this.currentUser;
      // student account types cannot toggle to teacher role
      if (currentUser.accountType === 'S') {
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
          this.set('actionToConfirm', null);
          this.store.unloadAll('assignment');
          this.sendAction('toHome');
          this.alert.showToast(
            'success',
            'Successfully switched roles',
            'bottom-end',
            2500,
            false,
            null
          );
        })
        .catch((err) => {
          // handle error
          this.handleErrors(err, 'toggleRoleErrors', currentUser);
          this.set('isToggleError', true);
          // send error up to application level to handle?
        });
    },
  },
});
