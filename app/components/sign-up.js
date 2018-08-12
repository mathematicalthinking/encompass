Encompass.SignUpComponent = Ember.Component.extend({
  classNames: ['signup-page'],
  usernameExists: false,
  missingCredentials: false,
  noTermsAndConditions: false,
  incorrectEmail: false,
  agreedToTerms: false,
  emailExistsError: null,
  org: null,


  regEx: /[a - z0 - 9!#$%& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

  validateEmail: function() {
    var email = this.get('email');
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    var emailTest = emailPattern.test(email);
    console.log(emailTest);

    if (emailTest === false) {
      console.log('false email');
      this.set('incorrectEmail', true);
      return false;
    }

    if (emailTest === true) {
      console.log('true email');
      this.set('incorrectEmail', false);
      return true;
    }

  },

  isEmailValid: function() {
    if (!this.get('isEmailDirty') && !Ember.isEmpty(this.get('email'))) {
      this.set('isEmailDirty', true);
    }
    return this.validateEmail();
  }.property('email'),

  // We don't want error being displayed when form loads initially
  isEmailInvalid: Ember.computed('isEmailValid', 'isEmailDirty', function() {
    return this.get('isEmailDirty') && !this.get('isEmailValid');
  }),

  doEmailsMatch: function() {
    return this.get('email') === this.get('confirmEmail');
  }.property('email', 'confirmEmail'),

  isPasswordValid: function() {
    if (!this.get('isPasswordDirty') && !Ember.isEmpty(this.get('password'))) {
      this.set('isPasswordDirty', true);
    }
    //TODO: stricter password req
    if (Ember.isEmpty(this.get('password'))) {
      return false;
    }
    return this.get('password').length > 3;
  }.property('password'),

  isPasswordInvalid: Ember.computed('isPasswordValid', 'isPasswordDirty', function() {
    return this.get('isPasswordDirty') && !this.get('isPasswordValid');
  }),

  doPasswordsMatch: function() {
    return this.get('password') === this.get('confirmPassword');
  }.property('password', 'confirmPassword'),

  createUser: function(data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('Invalid data');
      }
      Ember.$.post({
        url: '/auth/signup',
        data: data
      })
      .then((res) => {
        return resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  handleOrg: function(org) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (!org) {
        return reject('Invalid Data');
      }
      if (typeof org === 'string') {
        let rec = that.store.createRecord('organization', {
          name: org
        });

        rec.save()
        .then((res) => {
          console.log('res', res);
          return resolve(res.get('organizationId'));
        })
        .catch((err) => {
          return reject(err);
        });
      } else {
        return resolve(org.get('organizationId'));
      }

    });
  },

  actions: {
    signup: function () {
      var that = this;
      var name = that.get('name');
      var email = that.get('email');
      var confirmEmail = that.get('confirmEmail');
      var organization = that.get('org');
      console.log('org', organization);
      var location = that.get('location');
      var username = that.get('username');
      var password = that.get('password');
      var confirmPassword = that.get('confirmPassword');
      var requestReason = that.get('requestReason');
      var doPasswordsMatch = that.get('doPasswordsMatch');
      var doEmailsMatch = that.get('doEmailsMatch');


      if (!name || !email || !organization || !location || !username || !password || !requestReason || !confirmEmail || !confirmPassword) {
        that.set('missingCredentials', true);
        return;
      }

      if (!this.get('agreedToTerms')) {
        that.set('noTermsAndConditions', true);
        return;
      }

      if (!doPasswordsMatch || !doEmailsMatch) {
        return;
      }


      var createUserData = {
        name: name,
        email: email,
        location: location,
        username: username,
        password: password,
        requestReason: requestReason,
        accountType: 'T'
      };

      return that.handleOrg(organization)
      .then((org) => {
        createUserData.organization = org;
        return that.createUser(createUserData)
        .then((res) => {
          if (res.message === 'Username already exists') {
            that.set('usernameExists', true);
          } else if (res.message === 'There already exists a user with that email address.') {
            that.set('emailExistsError', res.message);
          } else {
            // TODO: Change how we're redirecting
            that.sendAction('toHome');
          }
        })
        .catch((err) => {
          console.log(err);
        });
      })
      .catch((err) => {
        console.log(err);
      });
    },

    resetErrors(e) {
      const errors = ['usernameExists', 'missingCredentials', 'noTermsAndConditions'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  }
});
