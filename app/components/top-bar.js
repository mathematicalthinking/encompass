import Component from '@ember/component';
import { inject as service } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';

export default Component.extend(CurrentUserMixin, {
  tagName: 'header',
  errorHandling: service('error-handling'),
  toggleRoleErrors: [],
  alert: service('sweet-alert'),

  toggleRoleErrors: [],
  open: false,

  init() {
    this._super(...arguments);
    this.handleClickOutside = this._handleClickOutside.bind(this);
  },

  didInsertElement() {
    this._super(...arguments);
    document.addEventListener('click', this.handleClickOutside);
  },

  willDestroyElement() {
    this._super(...arguments);
    document.removeEventListener('click', this.handleClickOutside);
  },

  _handleClickOutside(event) {
    if (this.open && !this.element.contains(event.target)) {
      this.set('open', false);
    }
  },

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
      const currentUser = this.currentUser;
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
          this.errorHandling.handleErrors(err, 'toggleRoleErrors', currentUser);
          this.set('isToggleError', true);
        });
    },
  },
});
