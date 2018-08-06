Encompass.LogInComponent = Ember.Component.extend({
  classNames: ['login-page'],
  incorrectPassword: false,
  incorrectUsername: false,
  missingCredentials: false,

  actions: {
    login: function () {
      var that = this;
      var username = that.get('username');
      var password = that.get('password');

      if (!username || !password) {
        that.set('missingCredentials', true);
        return;
      }

      var createUserData = {
        username: username,
        password: password,
      };
      Ember.$.post({
        url: '/auth/login',
        data: createUserData
      }).
      then((res) => {
        if (res.message === 'Incorrect password') {
          that.set('incorrectPassword', true);
        }else if(res.message === 'Incorrect username') {
          that.set('incorrectUsername', true);
        } else  {
          that.sendAction('toHome');
        }
      })
      .catch(console.log);
    },

    resetErrors(e) {
      if (this.get('incorrectUsername')) {
        this.set('incorrectUsername', false);
      }
      if (this.get('incorrectPassword')) {
        this.set('incorrectPassword', false);
      }
      if (this.get('missingCredentials')) {
        this.set('missingCredentials', false);
      }
    }
  }
});
