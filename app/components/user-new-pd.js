import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import UserSignupMixin from '../mixins/user_signup_mixin';

export default Component.extend(ErrorHandlingMixin, UserSignupMixin, {
  router: service('router'),
  elementId: 'user-new-pd',
  alert: service('sweet-alert'),
  errorMessage: null,
  username: '',
  password: '',
  firstName: '',
  lastName: '',
  email: '',
  org: null,
  location: '',
  accountTypes: ['Teacher', 'Student'],
  isAuthorized: null,
  authorizedBy: '',
  newUserData: {},
  actingRole: null,
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
      var currentUser = this.currentUser;
      var username = this.username;
      var password = this.password;
      var firstName = this.firstName;
      var lastName = this.lastName;
      var email = this.email;
      var organization = currentUser.get('organization');
      var organizationId = organization.get('id');
      var location = this.location;
      var accountType = this.selectedType;
      var accountTypeLetter = accountType.charAt(0).toUpperCase();
      var isAuthorized = this.isAuthorized;
      var currentUserId = currentUser.get('id');

      if (!username || !password || !accountType) {
        this.set('errorMessage', true);
        return;
      }

      if (accountTypeLetter !== 'S') {
        this.set('actingRole', 'teacher');
        if (!email) {
          this.set('errorMessage', true);
          return;
        }
      } else {
        email = null;
      }

      if (isAuthorized) {
        let userData = {
          username,
          password,
          firstName,
          lastName,
          email,
          location,
          accountType: accountTypeLetter,
          organization: organizationId,
          isAuthorized: true,
          authorizedBy: currentUserId,
          createdBy: currentUserId,
        };
        this.set('authorizedBy', currentUserId);
        this.set('newUserData', userData);
      } else {
        let userData = {
          username,
          password,
          firstName,
          lastName,
          email,
          location,
          accountType: accountTypeLetter,
          organization: organizationId,
          isAuthorized: false,
          createdBy: currentUserId,
        };
        this.set('newUserData', userData);
      }

      if (!username) {
        return;
      }

      let newUserData = this.newUserData;
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
          } else if (
            res.message ===
            'There already exists a user with that email address'
          ) {
            this.set('emailError', this.emailErrors.taken);
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

    resetErrors(e) {
      const errors = ['usernameExists', 'emailExistsError', 'errorMessage'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  },
});
