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
      console.log('currentUser is', currentUser);
      console.log('currentUser org is', organization);
      console.log('currentUser org id is', organizationId);
      var location = this.get('location');
      var accountType = this.get('selectedType');
      var accountTypeLetter = accountType.charAt(0).toUpperCase();
      var isAuthorized = this.get('isAuthorized');
      var currentUserId = currentUser.get('id');

      if (!username || !password || !email || !accountType) {
        this.set('errorMessage', true);
        return;
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
          organization: organization,
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

    resetErrors() {
      if (this.get('usernameExists')) {
        this.set('usernameExists', false);
      }
      if (this.get('emailExistsError')) {
        this.set('emailExistsError', false);
      }
      if (this.get('errorMessage')) {
        this.set('errorMessage', false);
      }
    },
  }
});
