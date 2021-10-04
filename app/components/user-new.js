import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import UserSignupComponent from './user-signup';
import $ from 'jquery';

export default class UserNewComponent extends UserSignupComponent {
  @service router;
  @service store;
  @service('sweet-alert') alert;
  @tracked errorMessage = null;
  @tracked username = '';
  @tracked password = '';
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked email = '';
  @tracked org = null;
  @tracked location = '';
  get accountTypes() {
    return this.args.currentUser.isAdmin
      ? ['Teacher', 'Student', 'Pd Admin', 'Admin']
      : ['Teacher', 'Student'];
  }
  @tracked isAuthorized = null;
  @tracked authorizedBy = '';
  newUserData = {};
  @tracked actingRole = null;
  orgReq = null;
  @tracked createOrgErrors = [];
  @tracked createUserErrors = [];
  @tracked missingAccountType = false;
  createNewUser(data) {
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

  handleOrg(org) {
    var that = this;
    return new Promise((resolve, reject) => {
      if (!org) {
        return reject('Invalid Data');
      }

      let orgReq;
      // make sure user did not type in existing org
      if (typeof org === 'string') {
        let orgs = this.args.organizations;
        let matchingOrg = orgs.findBy('name', org);
        if (matchingOrg) {
          this.org = matchingOrg;
          org = matchingOrg;
        } else {
          orgReq = org;
        }
      }

      if (orgReq) {
        let rec = that.store.createRecord('organization', {
          name: orgReq,
          createdBy: that.get('currentUser'),
        });

        rec
          .save()
          .then((res) => {
            return resolve(res.get('organizationId'));
          })
          .catch((err) => {
            this.handleErrors(err, 'createOrgErrors', rec);
            return reject(err);
          });
      } else {
        return resolve(org.get('organizationId'));
      }
    });
  }

  //warn admin they are creating new org
  // When user hits save button we need to check if the org is a string, if it is then do a modal, else continue

  @action confirmOrg() {
    let org = this.org;
    if (typeof org === 'string') {
      let orgs = this.args.organizations;
      let [matchingOrg] = orgs.filter(
        (organization) => organization.name === org
      );
      if (matchingOrg) {
        this.newUser();
      } else {
        this.alert
          .showModal(
            'question',
            `Are you sure you want to create ${org}`,
            null,
            'Yes'
          )
          .then((result) => {
            if (result.value) {
              this.newUser();
            }
          });
        this.orgReq = org;
      }
    } else {
      this.newUser();
    }
  }

  async newUser() {
    var username = this.username;
    var password = this.password;
    var firstName = this.firstName;
    var lastName = this.lastName;
    var email = this.email;
    var organization =
      this.org || (await this.args.currentUser.get('organization'));
    var location = this.location;
    var accountType = this.selectedType || 'student';
    var accountTypeLetter;
    if (accountType) {
      accountTypeLetter = accountType.charAt(0).toUpperCase();
    } else {
      this.missingAccountType = true;
      $('.account').show();
      return;
    }
    var isAuthorized = this.isAuthorized;
    var currentUserId = this.args.currentUser.get('id');

    if (!username || !password) {
      this.errorMessage = true;
      $('.required').show();
      return;
    }

    if (accountTypeLetter !== 'S') {
      this.actingRole = 'teacher';
      if (!email) {
        this.errorMessage = true;
        return;
      }
    } else {
      email = null;
    }

    if (isAuthorized) {
      let userData = {
        username,
        password,
        firstName,
        lastName,
        email,
        location,
        accountType: accountTypeLetter,
        isAuthorized: true,
        authorizedBy: currentUserId,
        createdBy: currentUserId,
      };
      this.authorizedBy = currentUserId;
      this.newUserData = userData;
    } else {
      let userData = {
        username: username,
        password: password,
        firstName,
        lastName,
        email: email,
        location: location,
        accountType: accountTypeLetter,
        isAuthorized: false,
        createdBy: currentUserId,
      };
      this.newUserData = userData;
    }

    if (!username) {
      return;
    }

    return this.handleOrg(organization)
      .then((org) => {
        let newUserData = this.newUserData;
        newUserData.organization = org;
        return this.createNewUser(newUserData)
          .then((res) => {
            if (res.username) {
              this.alert.showToast(
                'success',
                `${res.username} created`,
                'bottom-end',
                3000,
                null,
                false
              );
              return this.router.transitionTo('users.user', res.id);
            }
            if (
              res.message === 'There already exists a user with that username'
            ) {
              this.usernameError = this.usernameErrors.taken;
            } else if (
              res.message ===
              'There already exists a user with that email address'
            ) {
              this.emailError = this.emailErrors.taken;
            } else {
              this.createUserErrors = [res.message];
            }
          })
          .catch((err) => {
            this.handleErrors(err, 'createUserErrors', newUserData);
          });
      })
      .catch(() => {
        // err should be handled within handleOrg function
      });
  }

  @action cancelNew() {
    this.router.transitionTo('users');
  }

  @action setOrg(org) {
    //  if (typeof org === 'string') {
    //    this.set('orgReq', org);
    //  } else {
    this.org = org;
    //  }
  }

  @action closeError(error) {
    $(`.${error}`).addClass('fadeOutRight');
    later(() => {
      $(`.${error}`).removeClass('fadeOutRight');
      $(`.${error}`).hide();
    }, 500);
  }
}
