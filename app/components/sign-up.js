/* eslint-disable */
Encompass.SignUpComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['signup-page'],
  usernameExists: false,
  missingCredentials: false,
  noTermsAndConditions: false,
  incorrectEmail: false,
  incorrectUsername: false,
  incorrectPassword: false,
  agreedToTerms: false,
  emailExistsError: null,
  org: null,
  postErrors: [],
  similarity: Ember.inject.service('string-similarity'),
  alert: Ember.inject.service('sweet-alert'),

  init: function() {
    this._super(...arguments);
    this.set('typeaheadHeader', '<label class="tt-header">Popular Organizations:</label>');
  },

  emailRegEx: /[a - z0 - 9!#$%& '*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&' * +/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,

  validateEmail: function() {
    var email = this.get('email');
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    var emailTest = emailPattern.test(email);

    if (emailTest === false) {
      this.set('incorrectEmail', true);
      return false;
    }

    if (emailTest === true) {
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
  getSimilarOrgs(org) {
    let orgs = this.get('organizations').toArray();
    // let requestedOrgName = this.get('org');
    let similarOrgs = _.filter(orgs, (org => {
      let name = org.get('name');
      let score = this.get('similarity').compareTwoStrings('name', org);
      return score > 0.2;
    }));
  },

  testSS: function() {
    let org = this.get('org');
    console.log('org', org);
    if (!org) {
      org = '';
    }
    let similarity = this.get('similarity');
    return similarity.compareTwoStrings('Drexel University', org);
    // return this.get('similarity.compareTwoStrings')('Drexel University', org);

  }.property('org'),

  actions: {
    signup: function () {
      var that = this;
      var name = that.get('name');
      var email = that.get('email');
      var confirmEmail = that.get('confirmEmail');
      var organization = that.get('org');
      var location = that.get('location');
      var username = that.get('username');
      var usernameTrim;
      if (username) {
        usernameTrim = username.trim();
      } else {
        usernameTrim = '';
      }
      var password = that.get('password');
      var confirmPassword = that.get('confirmPassword');
      var requestReason = that.get('requestReason');
      var doPasswordsMatch = that.get('doPasswordsMatch');
      var doEmailsMatch = that.get('doEmailsMatch');



      if (!name || !email || !organization || !location || !usernameTrim || !password || !requestReason || !confirmEmail || !confirmPassword) {
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
        username: usernameTrim,
        password: password,
        requestReason: requestReason,
        accountType: 'T',
        isAuthorized: false,
      };

      let orgRequest;

      // make sure user did not type in existing org
      if (typeof organization === 'string') {
        let orgs = this.get('organizations');
        let matchingOrg = orgs.findBy('name', organization);
        if (matchingOrg) {
          organization = matchingOrg;
        } else {
          orgRequest = organization;
        }
      }

      if (orgRequest) {
        let similarOrgs = this.getSimilarOrgs(orgRequest);
        if (!_.isEmpty(similarOrgs)) {
          console.log('similarORgs!', similarOrgs);
          let bestMatch = this.get('similarity').findBestMatch(orgRequest, similarOrgs.map(o => o.get('name')));
          this.get('alert').showModal('question', `Are you sure you want to create the new organization "${orgRequest}"? `, `There is at least one existing organization with a similar name: ${bestMatch}`, 'Yes')
            .then((result) => {
          if (!result.value) {
            return;
          }

        });
          // this.set('similarOrgs', similarOrgs);
          // return;
        }
        createUserData.organizationRequest = orgRequest;
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
          this.handleErrors(err, 'postErrors');
        });
      } else {
        createUserData.organization = organization.id;
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
          this.handleErrors(err, 'postErrors');
        });
      }
    },

    resetErrors(e) {
      const errors = ['usernameExists', 'missingCredentials', 'noTermsAndConditions'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },

    usernameValidate() {
      var username = this.get('username');
      if (username) {
        var usernamePattern = new RegExp(/^[a-z0-9.\-_@]{3,64}$/);
        var usernameTest = usernamePattern.test(username);

        if (usernameTest === false) {
          this.set('incorrectUsername', true);
          return;
        }

        if (usernameTest === true) {
          this.set('incorrectUsername', false);
          this.set('missingCredentials', false);
          return;
        }
      }
    },

    emailValidate() {
      var email = this.get('email');
      if (email) {
        var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
        var emailTest = emailPattern.test(email);

        if (emailTest === false) {
          this.set('incorrectEmail', true);
          return;
        }

        if (emailTest === true) {
          this.set('incorrectEmail', false);
          return;
        }
      }
    },
  }
});
