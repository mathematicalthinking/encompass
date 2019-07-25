Encompass.UserNewTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'user-new-teacher',
  alert: Ember.inject.service('sweet-alert'),
  usernameExists: null,
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
      var username = this.get('username');
      var password = this.get('password');
      var firstName = this.get('firstName');
      var lastName = this.get('lastName');
      var currentUser = this.get('currentUser');
      var currentUserId = currentUser.get('id');
      var organization = currentUser.get('organization.id');

      if (!username || !password) {
        this.set('errorMessage', true);
        return;
      }

      if (!username) {
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
          if (res.message === 'Username already exists') {
            this.set('usernameExists', true);
            return;
          } else if (res.message === 'There already exists a user with this email address') {
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
      const errors = ['usernameExists', 'errorMessage'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  }
});


