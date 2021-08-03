import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
/*global _:false */
import $ from 'jquery';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';
import UserSignupMixin from '../mixins/user_signup_mixin';

export default Component.extend(ErrorHandlingMixin, UserSignupMixin, {
  classNames: ['signup-page'],
  missingCredentials: false,
  noTermsAndConditions: false,
  agreedToTerms: false,
  org: null,
  postErrors: [],
  similarity: service('string-similarity'),
  alert: service('sweet-alert'),

  init: function () {
    this._super(...arguments);
    this.set(
      'typeaheadHeader',
      '<label class="tt-header">Popular Organizations:</label>'
    );

    this.set('orgRequestFilter', this.createOrgRequestFilter.bind(this));
  },

  createUser: function (data) {
    return new Promise((resolve, reject) => {
      if (!data) {
        return reject('Invalid data');
      }
      $.post({
        url: '/auth/signup',
        data: data,
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
    let stopWords = [
      'university',
      'college',
      'school',
      'the',
      'and',
      'of',
      'for',
      ' ',
    ];

    let orgs = this.organizations;

    if (!orgs) {
      return [];
    }

    let sliced = orgs.toArray().slice();

    let requestCompare = this.similarity.convertStringForCompare(
      orgRequest,
      stopWords
    );

    let similarOrgs = _.filter(sliced, (org) => {
      let name = org.get('name');
      let compare = this.similarity.convertStringForCompare(name, stopWords);
      let score = this.similarity.compareTwoStrings(compare, requestCompare);
      return score > 0.5;
    });
    return similarOrgs;
  },

  orgOptions: computed('orgs.[]', function () {
    let orgs = this.organizations;

    if (!orgs) {
      return [];
    }

    let toArray = orgs.toArray();
    let mapped = _.map(toArray, (org) => {
      return {
        id: org.id,
        name: org.get('name'),
      };
    });
    return mapped;
  }),

  createOrgRequestFilter(orgRequest) {
    if (!orgRequest) {
      return;
    }
    let orgs = this.organizations;
    let requestLower = orgRequest.trim().toLowerCase();
    let orgNamesLower = orgs.map((org) => {
      return org.get('name').toLowerCase();
    });
    // don't let user create org request if it matches exactly an existing org name
    return !_.contains(orgNamesLower, requestLower);
  },

  actions: {
    signup: function () {
      var that = this;
      var firstName = that.get('firstName');
      var lastName = that.get('lastName');
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

      if (
        !firstName ||
        !lastName ||
        !email ||
        (!organization && !orgRequest) ||
        !location ||
        !usernameTrim ||
        !password ||
        !requestReason ||
        !confirmEmail ||
        !confirmPassword
      ) {
        that.set('missingCredentials', true);
        return;
      }

      if (!this.agreedToTerms) {
        that.set('noTermsAndConditions', true);
        return;
      }

      if (this.usernameError) {
        return;
      }

      if (!doPasswordsMatch || !doEmailsMatch) {
        return;
      }

      var createUserData = {
        firstName,
        lastName,
        email,
        location,
        username: usernameTrim,
        password: password,
        requestReason: requestReason,
        accountType: 'T',
      };

      // make sure user did not type in existing org

      if (orgRequest) {
        let orgs = this.organizations;
        let matchingOrg = orgs.findBy('name', orgRequest);
        if (matchingOrg) {
          // duplicate name request
          organization = matchingOrg;
          createUserData.organization = matchingOrg.id;
        } else {
          createUserData.organizationRequest = orgRequest;
        }

        return that
          .createUser(createUserData)
          .then((res) => {
            if (res.username) {
              that
                .get('alert')
                .showToast(
                  'success',
                  `Signup successful`,
                  'bottom-end',
                  3000,
                  null,
                  false
                );
              window.location.href = '/';
            } else if (
              res.message === 'There already exists a user with that username'
            ) {
              that.set('usernameError', that.get('usernameErrors.taken'));
            } else if (
              res.message ===
              'There already exists a user with that email address'
            ) {
              that.set('emailError', that.get('emailErrors.taken'));
            } else {
              that.set('postErrors', [res.message]);
            }
          })
          .catch((err) => {
            that.handleErrors(err, 'postErrors');
          });
      } else {
        createUserData.organization = organization.id;
        return that
          .createUser(createUserData)
          .then((res) => {
            if (res.username) {
              that
                .get('alert')
                .showToast(
                  'success',
                  `Signup successful`,
                  'bottom-end',
                  3000,
                  null,
                  false
                );
              window.location.href = '/';
            } else if (
              res.message === 'There already exists a user with that username'
            ) {
              that.set('usernameError', that.get('usernameErrors.taken'));
            } else if (
              res.message ===
              'There already exists a user with that email address'
            ) {
              that.set('emailError', that.get('emailErrors.taken'));
            } else {
              that.set('postErrors', [res.message]);
            }
          })
          .catch((err) => {
            this.handleErrors(err, 'postErrors');
          });
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

      let org = this.organizations.findBy('id', val);
      if (!org) {
        return;
      }
      this.set('org', org);
    },

    processOrgRequest(input, callback) {
      let similarOrgs = this.getSimilarOrgs(input);
      let modalSelectOptions = {};

      if (similarOrgs.get('length') > 0) {
        let text = `Are you sure you want to submit a new organization request for ${input}? We found ${similarOrgs.get(
          'length'
        )} organizations with similar names. Please review the options in the dropdown to see if your desired organization already exists. If you decide to proceed with the organization request, the creation of the organization will be contingent on an admin's approval.`;
        for (let org of similarOrgs) {
          let id = org.get('id');
          let name = org.get('name');
          modalSelectOptions[id] = name;
        }
        modalSelectOptions[input] = `Yes, I am sure I want to create ${input}`;

        this.alert
          .showPromptSelect(
            'Similar Orgs Found',
            modalSelectOptions,
            'Choose existing org or confirm request',
            text
          )
          .then((result) => {
            if (result.value) {
              // user confirmed org request
              if (result.value === input) {
                this.set('didConfirmOrgRequest', true);
                this.set('orgRequest', input);
                let ret = {
                  name: input,
                  id: input,
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
        id: input,
      };
      this.set('orgRequest', input);

      return callback(ret);
    },
  },
});
