'use strict';

/**
  * # Users Controller
  * @description Controller for creating a new user. 
  * @authors Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
*/
Encompass.UsersNewController = Ember.Controller.extend({
  newUserUsername: '',
  newUserName: '',
  newUserAuthorized: true,

  actions: {
    newUser: function newUser() {
      var newUserUsername = this.get('newUserUsername');
      var newUserName = this.get('newUserName');
      var newUserAuthorized = this.get('newUserAuthorized');
      this.set('newUserUsername', '');
      console.debug('creating new user ' + newUserUsername);

      if (!newUserUsername) {
        return;
      }

      var user = this.store.createRecord('user', {
        username: newUserUsername,
        name: newUserName,
        isAuthorized: newUserAuthorized
      });

      user.save();
    },

    checkUsername: function checkUsername(keysPressed) {
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
//# sourceMappingURL=users_new_controller.js.map
