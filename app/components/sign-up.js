import UserSignupComponent from './user-signup';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import $ from 'jquery';
import isNull from 'lodash-es/isNull';
import filter from 'lodash-es/filter';
import map from 'lodash-es/map';

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

    let similarOrgs = filter(sliced, (org) => {
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
    let mapped = map(toArray, (org) => {
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
    return !orgNamesLower.includes(requestLower);
  }
  @action signup() {
    var firstName = this.firstName;
    var lastName = this.lastName;
    var email = this.email;
    var confirmEmail = this.confirmEmail;
    var organization = this.org;
    var orgRequest = this.orgRequest;
    var location = this.location;
    var username = this.username;
    var usernameTrim;
    if (username) {
      usernameTrim = username.trim();
    } else {
      usernameTrim = '';
    }
    var password = this.password;
    var confirmPassword = this.confirmPassword;
    var requestReason = this.requestReason;
    var doPasswordsMatch = this.doPasswordsMatch;
    var doEmailsMatch = this.doEmailsMatch;

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
      this.missingCredentials = true;
      return;
    }

    if (!this.agreedToTerms) {
      this.noTermsAndConditions = true;
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
      accountType: 'S',
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

      return this.createUser(createUserData)
        .then((res) => {
          if (res.username) {
            this.alert.showToast(
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
            this.usernameError = this.usernameErrors.taken;
          } else if (
            res.message ===
            'There already exists a user with that email address'
          ) {
            this.emailError = this.emailErrors.taken;
          } else {
            this.postErrors = [res.message];
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'postErrors');
        });
    } else {
      createUserData.organization = organization.id;
      return this.createUser(createUserData)
        .then((res) => {
          if (res.username) {
            this.alert.showToast(
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
            this.usernameError = this.usernameErrors.taken;
          } else if (
            res.message ===
            'There already exists a user with that email address'
          ) {
            this.emailError = this.emailErrors.taken;
          } else {
            this.postErrors = [res.message];
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

    let isRemoval = isNull($item);
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
            $('select')[0].selectize.setValue(result.value, true);
            $('select')[0].selectize.removeOption(input);
            return callback(null);
          } else {
            // user hit cancel
            // remove option from dropdown
            $('select')[0].selectize.removeOption(input);
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
