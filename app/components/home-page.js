import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject } from '@ember/service';
import CurrentUserMixin from '../mixins/current_user_mixin';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(CurrentUserMixin, ErrorHandlingMixin, {
  tagName: '',
  // elementId: 'homepage',
  className: ['homepage', 'index'],
  // classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
  isSmallHeader: false,
  isHidden: false,
  openMenu: false,
  toggleRoleErrors: [],
  alert: inject('sweet-alert'),

  isStudent: computed('user.actingRole', 'user.id', function () {
    return (
      this.user.get('isStudent') || this.user.get('actingRole') === 'student'
    );
  }),

  notStudent: Ember.computed.not('isStudent'),

  didReceiveAttrs: function () {
    let currentUser = this.currentUser;
    this.set(
      'isStudentAccount',
      currentUser && currentUser.get('accountType') === 'S'
    );
  },

  actions: {
    largeHeader: function () {
      this.set('isSmallHeader', false);
    },
    smallHeader: function () {
      this.set('isSmallHeader', true);
    },
    toggleMenu: function () {
      // console.log('toggle called', this.openMenu);
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
          this.set('actionToConfirm', null);
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
        .catch((err) => {
          // handle error
          this.handleErrors(err, 'toggleRoleErrors', currentUser);
          this.set('isToggleError', true);
          // send error up to application level to handle?
        });
    },
  },
});
