import UserSignupComponent from './user-signup';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import _ from 'underscore';
import $ from 'jquery';

export default class SignUpComponent extends UserSignupComponent {
  @tracked missingCredentials = false;
  @tracked noTermsAndConditions = false;
  @tracked agreedToTerms = false;
  @tracked org = null;
  @tracked postErrors = [];
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked org = null;
  @tracked location = '';
  @tracked requestReason = '';
  @tracked agreedToTerms = false;
  @tracked doEmailsMatch = false;
  orgRequest = null;
  didConfirmOrgRequest = false;
  @service('string-similarity') similarity;
  @service('sweet-alert') alert;

  createUser(data) {
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
  }
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

    let orgs = this.args.organizations;

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
  }
  get orgOptions() {
    let orgs = this.args.organizations;

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
  }

  @action
  orgRequestFilter(orgRequest) {
    if (!orgRequest) {
      return;
    }
    let orgs = this.args.organizations;
    let requestLower = orgRequest.trim().toLowerCase();
    let orgNamesLower = orgs.map((org) => {
      return org.get('name').toLowerCase();
    });
    // don't let user create org request if it matches exactly an existing org name
    return !_.contains(orgNamesLower, requestLower);
  }
  @action signup() {
    var that = this;
    var firstName = that.firstName;
    var lastName = that.lastName;
    var email = that.email;
    var confirmEmail = that.confirmEmail;
    var organization = that.org;
    var orgRequest = that.orgRequest;
    var location = that.location;
    var username = that.username;
    var usernameTrim;
    if (username) {
      usernameTrim = username.trim();
    } else {
      usernameTrim = '';
    }
    var password = that.password;
    var confirmPassword = that.confirmPassword;
    var requestReason = that.requestReason;
    var doPasswordsMatch = that.doPasswordsMatch;
    var doEmailsMatch = that.doEmailsMatch;

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
      that.missingCredentials = true;
      return;
    }

    if (!this.agreedToTerms) {
      that.noTermsAndConditions = true;
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
      let orgs = this.args.organizations;
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
            that.usernameError = that.usernameErrors.taken;
          } else if (
            res.message ===
            'There already exists a user with that email address'
          ) {
            that.emailError = that.emailErrors.taken;
          } else {
            that.postErrors = [res.message];
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
            that.usernameError = that.usernameErrors.taken;
          } else if (
            res.message ===
            'There already exists a user with that email address'
          ) {
            that.emailError = that.emailErrors.taken;
          } else {
            that.postErrors = [res.message];
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'postErrors');
        });
    }
  }

  @action setOrg(val, $item) {
    // val is orgId
    if (!val) {
      return;
    }

    let isRemoval = _.isNull($item);
    if (isRemoval) {
      this.org = null;
      return;
    }

    let org = this.args.organizations.findBy('id', val);
    if (!org) {
      return;
    }
    this.org = org;
  }

  @action processOrgRequest(input, callback) {
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
              this.didConfirmOrgRequest = true;
              this.orgRequest = input;
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
    this.orgRequest = input;

    return callback(ret);
  }
}
