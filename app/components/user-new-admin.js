Encompass.UserNewAdminComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new-admin',
  usernameExists: null,
  emailExistsError: null,
  errorMessage: null,
  username: '',
  password: '',
  name: '',
  email: '',
  org: null,
  location: '',
  accountTypes: ['Teacher', 'Student', 'Pd Admin', 'Admin'],
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

  handleOrg: function (org) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (!org) {
        return reject('Invalid Data');
      }
      if (typeof org === 'string') {
        let rec = that.store.createRecord('organization', {
          name: org
        });

        rec.save()
          .then((res) => {
            console.log('res', res);
            return resolve(res.get('organizationId'));
          })
          .catch((err) => {
            return reject(err);
          });
      } else {
        return resolve(org.get('organizationId'));
      }

    });
  },

  actions: {
    newUser: function () {
      var username = this.get('username');
      var password = this.get('password');
      var name = this.get('name');
      var email = this.get('email');
      var organization = this.get('org');
      var location = this.get('location');
      var accountType = this.get('selectedType');
      var accountTypeLetter = accountType.charAt(0).toUpperCase();
      var isAuthorized = this.get('isAuthorized');
      var currentUserId = this.get('currentUser').get('id');

      if (!username || !password || !organization || !accountType) {
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
          isAuthorized: false,
          createdBy: currentUserId,
          createDate: new Date(),
        };
        this.set('newUserData', userData);
      }

      if (!username) {
        return;
      }

      return this.handleOrg(organization)
        .then((org) => {
          let newUserData = this.get('newUserData');
          newUserData.organization = org;
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
        })
        .catch((err) => {
          console.log(err);
        });
    },

    checkUsername: function (keysPressed) {
      var errorMsg = 'Please enter usernames in lower case only';
      var caseSensitive = /[A-Z]/;
      var username = this.get('newUserUsername');

      if (caseSensitive.test(username)) {
        window.alert(errorMsg);
        this.set('newUserUsername', keysPressed.toLowerCase());
      }
    },

    resetErrors(e) {
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
