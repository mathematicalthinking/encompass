Encompass.UserNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-new',
  className: ['user-new'],
  username: '',
  password: '',
  name: '',
  email: '',
  organization: '',
  location: '',
  isStudent: '',
  isAdmin: false,
  isAuthorized: '',
  authorizedBy: '',

  actions: {
    newUser: function () {
      var username = this.get('username');
      var password = this.get('password');
      var name = this.get('name');
      var email = this.get('email');
      var organization = this.get('organization');
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

      var user = this.store.createRecord('user', {
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
      });

      user.save().then((res) => {
        // this.sendAction('toUserList');
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



