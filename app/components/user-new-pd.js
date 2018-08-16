Encompass.UserNewPdComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new-pd',
  usernameExists: null,
  emailExistsError: null,
  errorMessage: null,
  username: '',
  password: '',
  name: '',
  email: '',
  org: null,
  location: '',
  accountTypes: ['Teacher', 'Student'],
  isAuthorized: null,
  authorizedBy: '',
  newUserData: {},

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
      var name = this.get('name');
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
        if (!email) {
          this.set('errorMessage', true);
          return;
        }
      } else {
        email = null;
      }

      if (isAuthorized) {
        let userData = {
          username: username,
          password: password,
          name: name,
          email: email,
          location: location,
          accountType: accountTypeLetter,
          organization: organizationId,
          isAuthorized: true,
          authorizedBy: currentUserId,
          createdBy: currentUserId,
          createDate: new Date(),
        };
        this.set('authorizedBy', currentUserId);
        this.set('newUserData', userData);
      } else {
        let userData = {
          username: username,
          password: password,
          name: name,
          email: email,
          location: location,
          accountType: accountTypeLetter,
          organization: organizationId,
          isAuthorized: false,
          createdBy: currentUserId,
          createDate: new Date(),
        };
        this.set('newUserData', userData);
      }

      if (!username) {
        return;
      }

      let newUserData = this.get('newUserData');
      return this.createNewUser(newUserData)
        .then((res) => {
          console.log('res is', res);
          console.log('res message is', res.message);
          if (res.message === 'Can add existing user') {
            this.set('usernameExists', true);
          } else if (res.message === 'There already exists a user with that email address.') {
            this.set('emailExistsError', res.message);
          }
        }).then((user) => {
          // this.sendAction('toUserInfo', user.username);
        })
        .catch((err) => {
          console.log(err);
        });
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
