import Component from '@ember/component';
import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  tagName: 'header',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
  elementId: 'al_header',
  isSmallHeader: false,
  isHidden: false,
  openMenu: false,
  toggleRoleErrors: [],
  alert: service('sweet-alert'),

  make: [
    { text: 'assignment', link: 'assignments.new', restricted: true },
    {
      text: 'workspace',
      link: 'workspaces.new',
      restricted: true,
      children: [
        { link: 'workspaces.new', text: 'new' },
        { link: 'import', text: 'import' },
        { link: 'workspaces.copy', text: 'copy' },
        { link: 'vmt.import', text: 'vmt' },
      ],
    },
    { text: 'problem', link: 'problem' },
    { text: 'class', link: 'sections.new' },
    { text: 'users', link: 'users.new' },
  ],

  do: [
    { text: 'solve a problem', link: 'assignments', restricted: false },
    { text: 'review submitted work', link: 'workspaces', restricted: false },
    { text: 'mentor submission', link: 'responses', restricted: false },
    { text: 'manage classes', link: 'sections', restricted: true },
    { text: 'manage users', link: 'users', restricted: true },
  ],

  find: [
    { text: 'assignment', link: 'assignments', restricted: false },
    { text: 'workspace', link: 'workspaces', restricted: false },
    { text: 'problem', link: 'problems', restricted: false },
    { text: 'class', link: 'sections', restricted: false },
    { text: 'users', link: 'users', restricted: true },
  ],

  isStudent: computed('user.actingRole', 'user.id', function () {
    return (
      this.user.get('isStudent') || this.user.get('actingRole') === 'student'
    );
  }),

  notStudent: not('isStudent'),

  didReceiveAttrs: function () {
    let currentUser = this.currentUser;
    if (currentUser) {
      this.set('isStudentAccount', currentUser.get('accountType') === 'S');
    }
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
