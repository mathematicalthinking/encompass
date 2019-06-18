/*global _:false */
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

    this.set('orgRequestFilter', this.createOrgRequestFilter.bind(this));
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
  getSimilarOrgs(orgRequest) {
    let stopWords = ['university', 'college', 'school', 'the', 'and', 'of', 'for', ' '];

    let orgs = this.get('organizations');

    if (!orgs) {
      return [];
    }

    let sliced = orgs.toArray().slice();

    let requestCompare = this.get('similarity').convertStringForCompare(orgRequest, stopWords);

    let similarOrgs = _.filter(sliced, (org => {
      let name = org.get('name');
      let compare = this.get('similarity').convertStringForCompare(name, stopWords);
      let score = this.get('similarity').compareTwoStrings(compare, requestCompare);
      return score > 0.5;
    }));
    return similarOrgs;
  },

  orgOptions: function() {
    let orgs = this.get('organizations');

    if (!orgs) {
      return [];
    }

    let toArray = orgs.toArray();
    let mapped = _.map(toArray, (org) => {
      return {
        id: org.id,
        name: org.get('name')
      };

    });
    return mapped;
  }.property('orgs.[]'),

  createOrgRequestFilter(orgRequest) {
    if (!orgRequest) {
      return;
    }
    let orgs = this.get('organizations');
    let requestLower = orgRequest.trim().toLowerCase();
    let orgNamesLower = orgs.map( (org) => {
      return org.get('name').toLowerCase();
    });
    // don't let user create org request if it matches exactly an existing org name
    return !_.contains(orgNamesLower, requestLower);
  },

  actions: {
    signup: function () {
      var that = this;
      var name = that.get('name');
      var email = that.get('email');
      var confirmEmail = that.get('confirmEmail');
      var organization = that.get('org');
      var orgRequest = that.get('orgRequest');
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



      if (!name || !email || (!organization && !orgRequest) || !location || !usernameTrim || !password || !requestReason || !confirmEmail || !confirmPassword) {
        that.set('missingCredentials', true);
        return;
      }

      if (!this.get('agreedToTerms')) {
        that.set('noTermsAndConditions', true);
        return;
      }

      if (this.get('incorrectUsername')) {
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

      // make sure user did not type in existing org

      if (orgRequest) {

        let orgs = this.get('organizations');
        let matchingOrg = orgs.findBy('name', orgRequest);
        if (matchingOrg) {
          // duplicate name request
          organization = matchingOrg;
          createUserData.organization = matchingOrg.id;
        } else {
          createUserData.organizationRequest = orgRequest;

        }


        return that.createUser(createUserData)
        .then((res) => {
          if (res.message === 'Username already exists') {
            that.set('usernameExists', true);
          } else if (res.message === 'There already exists a user with that email address.') {
            that.set('emailExistsError', res.message);
          } else {
            window.location.href= '/';
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
            window.location.href = '/';
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

    setOrg(val, $item) {
      // val is orgId
      if (!val) {
        return;
      }

      let isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('org', null);
        return;
      }

      let org = this.get('organizations').findBy('id', val);
      if (!org) {
        return;
      }
      this.set('org', org);
    },

    processOrgRequest(input, callback) {
      let similarOrgs = this.getSimilarOrgs(input);
      let modalSelectOptions = {};


      if (similarOrgs.get('length') > 0) {
        let text = `Are you sure you want to submit a new organization request for ${input}? We found ${similarOrgs.get('length')} organizations with similar names. Please review the options in the dropdown to see if your desired organization already exists. If you decide to proceed with the organization request, the creation of the organization will be contingent on an admin's approval.`;
        for (let org of similarOrgs) {
          let id = org.get('id');
          let name = org.get('name');
          modalSelectOptions[id] = name;
        }
        modalSelectOptions[input] = `Yes, I am sure I want to create ${input}`;

        this.get('alert').showPromptSelect('Similar Orgs Found', modalSelectOptions, 'Choose existing org or confirm request', text)
        .then((result) => {
          if (result.value) {
            // user confirmed org request
            if (result.value === input) {
              this.set('didConfirmOrgRequest', true);
              this.set('orgRequest', input);
              let ret = {
                name: input,
                id: input
              };
              return callback(ret);
            }
            // user selected an existing org
            this.$('select')[0].selectize.setValue(result.value, true);
            this.$('select')[0].selectize.removeOption(input);
            return callback(null);

          } else {
            // user hit cancel
            // remove option from dropdown
            this.$('select')[0].selectize.removeOption(input);
            return callback(null);
          }
        });
      }
      // no similar orgs, create org request
      let ret = {
        name: input,
        id: input
      };
      this.set('orgRequest', input);

      return callback(ret);


    }
  }
});
