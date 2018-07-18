Encompass.SignUpComponent = Ember.Component.extend({
  classNames: ['signup-page'],
  usernameExists: false,
  missingCredentials: false,
  noTermsAndConditions: false,
  incorrectEmail: false,
  agreedToTerms: null,
  emailExistsError: null,
  org: null,


  regEx: /[a - z0 - 9!#$%& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

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
      var organization = that.get('org');
      console.log('org', organization);
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

      // determine if need to create new organization
      var createUserData = {
        name: name,
        email: email,
        //organization: organization.id,
        location: location,
        username: username,
        password: password,
        requestReason: requestReason
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
      if (this.get('usernameExists')) {
        this.set('usernameExists', false);
      }
      if (this.get('missingCredentials')) {
        this.set('missingCredentials', false);
      }
      if (this.get('noTermsAndConditions')) {
        this.set('noTermsAndConditions', false);
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
