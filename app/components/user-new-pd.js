Encompass.UserNewPdComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'user-new-pd',
  alert: Ember.inject.service('sweet-alert'),
  usernameExists: null,
  emailExistsError: null,
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
      Ember.$.post({
          url: '/auth/signup',
          data: data
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
      var currentUser = this.get('currentUser');
      var username = this.get('username');
      var password = this.get('password');
      var firstName = this.get('firstName');
      var lastName = this.get('lastName');
      var email = this.get('email');
      var organization = currentUser.get('organization');
      var organizationId = organization.get('id');
      var location = this.get('location');
      var accountType = this.get('selectedType');
      var accountTypeLetter = accountType.charAt(0).toUpperCase();
      var isAuthorized = this.get('isAuthorized');
      var currentUserId = currentUser.get('id');

      if (!username || !password || !accountType) {
        this.set('errorMessage', true);
        return;
      }

      if (accountTypeLetter !== "S") {
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

      let newUserData = this.get('newUserData');
      return this.createNewUser(newUserData)
        .then((res) => {
          if (res.message === 'There already exists a user with that username') {
            this.set('usernameExists', true);
            return;
          } else if (res.message === 'There already exists a user with that email address') {
            this.set('emailExistsError', res.message);
            return;
          } else {
            this.get('alert').showToast('success', `${res.username} created`, 'bottom-end', 3000, null, false);
            this.sendAction('toUserInfo', res.username);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'createUserErrors', newUserData);
        });
    },

    usernameValidate(username) {
      if (username) {
        var usernamePattern = new RegExp(/^[a-z0-9.\-_@]{3,64}$/);
        var usernameTest = usernamePattern.test(username);

        if (usernameTest === false) {
          this.set('incorrectUsername', true);
          return;
        }

        if (usernameTest === true) {
          this.set('incorrectUsername', false);
          this.set('username', username);
          return;
        }
      }
    },

    emailValidate: function (email) {
      if (!email) {
        return false;
      }
      var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
      var emailTest = emailPattern.test(email);

      if (emailTest === false) {
        this.set('incorrectEmail', true);
        return false;
      }

      if (emailTest === true) {
        this.set('incorrectEmail', false);
        this.set('email', email);
        return true;
      }
    },

    passwordValidate: function (password) {
      function hasWhiteSpace(string) {
        return /\s/g.test(string);
      }

      if (password.length < 3) {
        this.set('invalidPassword', true);
      } else {
        this.set('invalidPassword', false);
        this.set('password', password);
      }

      if (hasWhiteSpace(password)) {
        this.set('noSpacesError', true);
      } else {
        this.set('noSpacesError', false);
        this.set('password', password);
      }
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
  }
});
