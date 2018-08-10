Encompass.UserNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new',
  className: ['user-new'],
  usernameExists: false,
  emailExistsError: null,
  username: '',
  password: '',
  name: '',
  email: '',
  org: null,
  location: '',
  isStudent: '',
  isAdmin: false,
  isAuthorized: '',
  authorizedBy: '',

  actions: {
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

    newUser: function () {
      var username = this.get('username');
      var password = this.get('password');
      var name = this.get('name');
      var email = this.get('email');
      var organization = this.get('org');
      var location = this.get('location');
      var isStudent = this.get('isStudent');
      var isAdmin = this.get('isAdmin');
      var isAuthorized = this.get('isAuthorized');
      var currentUser = this.get('currentUser');
      if (isAuthorized) {
        this.set('authorizedBy', currentUser);
      } else {
        this.set('authorizedBy', null);
      }
      this.set('newUserUsername', '');
      console.debug('creating new user ' + username);

      if (!username) {
        return;
      }

      var newUserData = {
        username: username,
        password: password,
        name: name,
        email: email,
        organization: organization,
        location: location,
        isStudent: isStudent,
        isAdmin: isAdmin,
        isAuthorized: isAuthorized,
        authorizedBy: this.get('authorizedBy'),
        createdBy: currentUser,
        createDate: new Date(),
      };

      return this.handleOrg(organization)
        .then((org) => {
          newUserData.organization = org;
          return this.createNewUser(newUserData)
            .then((res) => {
              if (res.message === 'Username already exists') {
                this.set('usernameExists', true);
              } else if (res.message === 'There already exists a user with this email address.') {
                this.set('emailExistsError', res.message);
              } else {
                // TODO: Change how we're redirecting
                this.sendAction('toUserInfo', res);
              }
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
    }
  }
});

