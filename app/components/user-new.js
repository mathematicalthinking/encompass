Encompass.UserNewComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
    elementId: 'user-new',
    className: ['user-new'],
    newUserUsername: '',
    newUserName: '',
    newUserAuthorized: true,

    actions: {
      newUser: function () {
        var newUserUsername = this.get('newUserUsername');
        var newUserName = this.get('newUserName');
        var newUserAuthorized = this.get('newUserAuthorized');
        var currentUser = this.get('currentUser');
        this.set('newUserUsername', '');
        console.debug('creating new user ' + newUserUsername);

        if (!newUserUsername) {
          return;
        }

        var user = this.store.createRecord('user', {
          username: newUserUsername,
          name: newUserName,
          isAuthorized: newUserAuthorized,
          createdBy: currentUser,
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



