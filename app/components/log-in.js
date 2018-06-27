Encompass.LogInComponent = Ember.Component.extend({
  incorrectPassword: false,
  incorrectUsername: false,

  actions: {
    login: function () {
      console.log('login action called');
      var that = this;
      var username = that.get('username');
      console.log('username', username);
      var password = that.get('password');
      console.log('password', password);
      var createUserData = {
        username: username,
        password: password,
      };
      Ember.$.post({
        url: '/auth/login',
        data: createUserData
      }).
      then((res) => {
        console.log('res', res);
        if (res.message === 'Incorrect password') {
          console.log('wrong pass');
          that.set('incorrectPassword', true);
        }else if(res.message === 'Incorrect username') {
          that.set('incorrectUsername', true);
        } else  {
          console.log('in res block: ', res.username);
          that.sendAction('toHome');
        }
      })
      .catch(console.log);
    },

    toHome: function() {
      this.sendAction('toHome');
    },

    resetErrors(e) {
      console.log('e', e);
      if (this.get('incorrectUsername')) {
        this.set('incorrectUsername', false);
      }
      if (this.get('incorrectPassword')) {
        this.set('incorrectPassword', false);
      }
    }
  }
});
