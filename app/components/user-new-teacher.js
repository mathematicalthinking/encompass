Encompass.UserNewTeacherComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new-teacher',
  usernameExists: null,
  errorMessage: null,
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
            return;
          } else if (res.message === 'There already exists a user with this email address.') {
            this.set('emailExistsError', res.message);
            return;
          } else {
            console.log('success new user username', res.username);
            this.sendAction('toUserInfo', res.username);
          }
        })
        .catch((err) => {
          console.log(err);
        });

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


