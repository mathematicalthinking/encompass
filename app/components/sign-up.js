Encompass.SignUpComponent = Ember.Component.extend({
  usernameExists: false,
  missingCredentials: false,
  noTermsAndConditions: false,
  agreedToTerms: null,

  actions: {
    signup: function () {
      var that = this;
      var name = that.get('name');
      console.log(name);
      var email = that.get('email');
      console.log(email);
      var organization = that.get('organization');
      console.log(organization);
      var location = that.get('location');
      console.log(location);
      var username = that.get('username');
      console.log(username);
      var password = that.get('password');
      console.log(password);
      var requestReason = that.get('requestReason');
      console.log(requestReason);

      if (!name || !email || !organization || !location || !username || !password || !requestReason) {
        that.set('missingCredentials', true);
        return;
      }

      if (!this.get('agreedToTerms')) {
        that.set('noTermsAndConditions', true);
        return;
      }

      var createUserData = {
        name: name,
        email: email,
        organization: organization,
        location: location,
        username: username,
        password: password,
        requestReason: requestReason
      };
      Ember.$.post({
        url: '/auth/signup',
        data: createUserData
      }).
      then((res) => {
          console.log('res', res);
          if (res.message === 'Username already exists') {
            that.set('usernameExists', true);
          } else {
            console.log('in res block: ', res.username);
            that.sendAction('toHome');
          }
        })
        .catch(console.log);
    },

    toHome: function () {
      this.sendAction('toHome');
    },

    toggleCheck() {
      console.log(this.agreedToTerms);
      // this.set('agreedToTerms', true);
      if (this.agreedToTerms === true) {
        this.set('agreedToTerms', false);
      } else if (this.agreedToTerms === false) {
        this.set('agreedToTerms', true);
      } else {
        this.set('agreedToTerms', true);
      }
      if (this.get('noTermsAndConditions')) {
        this.set('noTermsAndConditions', false);
      }
    },

    resetErrors(e) {
      if (this.get('usernameExists')) {
        this.set('usernameExists', false);
      }
      if (this.get('missingCredentials')) {
        this.set('missingCredentials', false);
      }
    }
  }
});


