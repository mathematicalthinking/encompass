Encompass.UserNewTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new-teacher',
  usernameExists: false,
  username: '',
  password: '',
  name: '',
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
      var username = this.get('username');
      var password = this.get('password');
      var name = this.get('name');
      var currentUser = this.get('currentUser');
      var currentUserId = currentUser.get('id');
      var organization = currentUser.get('organization.id');

      this.set('username', '');
      this.set('password', '');
      this.set('name', '');

      if (!username) {
        return;
      }

      var newUserData = {
        username: username,
        password: password,
        name: name,
        organization: organization,
        accountType: 'S',
        isAuthorized: true,
        authorizedBy: currentUserId,
        createdBy: currentUserId,
        createDate: new Date(),
      };

      return this.createNewUser(newUserData)
        .then((res) => {
          if (res.message === 'Username already exists') {
            this.set('usernameExists', true);
          } else if (res.message === 'There already exists a user with this email address.') {
            this.set('emailExistsError', res.message);
          }
        }).then((user) => {
          this.sendAction('toUserInfo', user.username);
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
    }
  }
});
