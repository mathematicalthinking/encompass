Encompass.LogInComponent = Ember.Component.extend({

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
      });
    }
  }
});
