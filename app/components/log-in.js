Encompass.LogInComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['login-page'],
  incorrectPassword: false,
  incorrectUsername: false,
  missingCredentials: false,
  postErrors: [],

  oauthErrorMsg: function() {
    if (this.get('oauthError') === 'emailUnavailable') {
      return 'The provided email address is already associated with an existing account';
    }
  }.property('oauthError'),

  actions: {
    login: function () {
      var that = this;
      var username = that.get('username');
      var usernameTrim;
      if (username) {
        usernameTrim = username.trim();
      } else {
        usernameTrim = '';
      }
      var password = that.get('password');

      if (!usernameTrim || !password) {
        that.set('missingCredentials', true);
        return;
      }

      var createUserData = {
        username: usernameTrim,
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
      .catch((err) => {
        this.handleErrors(err, 'postErrors');
      });
    },

    resetErrors() {
      const errors = ['incorrectUsername', 'incorrectPassword', 'missingCredentials'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    }
  }
});
