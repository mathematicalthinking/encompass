Encompass.VmtLoginComponent = Ember.Component.extend(Encompass.VmtHostMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'vmt-login',

  incorrectPassword: false,
  incorrectUsername: false,
  missingCredentials: false,
  postErrors: [],

  actions: {
    login: function () {
      let vmtHost = this.getVmtHost();

      if (!vmtHost) {
        return;
      }

      let url = `${vmtHost}/auth/enc`;

      let username = this.get('username');

      let usernameTrim = typeof username === 'string' ? username.trim() : '';

      let password = this.get('password');

      if (!usernameTrim || !password) {
        this.set('missingCredentials', true);
        return;
      }

      let data = {
        username: usernameTrim,
        password: password,
      };
      Ember.$.post({
        url,
        data,
      })
      .then((res) => {
        console.log('vmt auth results', res);
        if (res.message === 'Incorrect password') {
          this.set('incorrectPassword', true);
        }else if(res.message === 'Incorrect username') {
          this.set('incorrectUsername', true);
        } else  {
          // handle token
          if (this.get('handleLoginResults')) {
            this.get('handleLoginResults')(res);
          }
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