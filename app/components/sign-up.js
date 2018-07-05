Encompass.SignUpComponent = Ember.Component.extend({
  usernameExists: false,
  missingCredentials: false,
  noTermsAndConditions: false,
  incorrectEmail: false,
  agreedToTerms: null,

  regEx: /[a - z0 - 9!#$%& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

  actions: {
    signup: function () {
      var that = this;
      var name = that.get('name');
      var email = that.get('email');
      var organization = that.get('organization');
      var location = that.get('location');
      var username = that.get('username');
      var password = that.get('password');
      var requestReason = that.get('requestReason');

      if (!name || !email || !organization || !location || !username || !password || !requestReason) {
        that.set('missingCredentials', true);
        return;
      }

      if (!this.get('agreedToTerms')) {
        that.set('noTermsAndConditions', true);
        return;
      }

      if (email) {
        var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
        var emailTest = emailPattern.test(email);

        if (this.emailTest === false) {
          console.log(emailPattern.test(email));
          console.log('false email');
          return;
        }

        if (this.emailTest === true) {
          console.log(emailPattern.test(email));
          console.log('true email');
          return;
        }
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
          if (res.message === 'Username already exists') {
            that.set('usernameExists', true);
          } else {
            that.sendAction('toHome');
          }
        })
        .catch(console.log);
    },



    toggleCheck() {
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
    },

    emailValidate() {
      var email = this.get('email');
      if (email) {
        var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
        var emailTest = emailPattern.test(email);
        console.log(emailTest);

        if (emailTest === false) {
          console.log('false email');
          this.set('incorrectEmail', true);
          return;
        }

        if (emailTest === true) {
          console.log('true email');
          this.set('incorrectEmail', false);
          return;
        }
      }
    },
  }
});
