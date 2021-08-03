import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import UserSignupMixin from '../mixins/user_signup_mixin';

export default Component.extend(ErrorHandlingMixin, UserSignupMixin, {
  router: service('router'),
  elementId: 'user-new-teacher',
  alert: service('sweet-alert'),
  errorMessage: null,
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  authorizedBy: '',
  newUserData: {},
  createUserErrors: [],

  createNewUser: function (data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('Invalid data');
      }
      $.post({
        url: '/auth/signup',
        data: data,
      })
        .then((res) => {
          return resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  actions: {
    newUser: function () {
      var username = this.username;
      var password = this.password;
      var firstName = this.firstName;
      var lastName = this.lastName;
      var currentUser = this.currentUser;
      var currentUserId = currentUser.get('id');
      var organization = currentUser.get('organization.id');

      if (!username || !password) {
        this.set('errorMessage', true);
        return;
      }

      if (this.passwordError || this.usernameError) {
        return;
      }

      var newUserData = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName,
        organization: organization,
        accountType: 'S',
        isAuthorized: true,
        authorizedBy: currentUserId,
        createdBy: currentUserId,
      };

      return this.createNewUser(newUserData)
        .then((res) => {
          if (res.username) {
            this.alert.showToast(
              'success',
              `${res.username} created`,
              'bottom-end',
              3000,
              null,
              false
            );
            return this.router.transitionTo('users.user', res.id);
          }
          if (
            res.message === 'There already exists a user with that username'
          ) {
            this.set('usernameError', this.usernameErrors.taken);
            return;
          } else if (
            res.message ===
            'There already exists a user with that email address'
          ) {
            this.set('emailError', this.emailErrors.taken);
            return;
          } else {
            this.set('createUserErrors', [res.message]);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'createUserErrors', newUserData);
        });
    },

    cancelNew: function () {
      this.sendAction('toUserHome');
    },
  },
});
