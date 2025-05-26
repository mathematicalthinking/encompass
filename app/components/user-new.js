import UserSignupComponent from './user-signup';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class UserNewComponent extends UserSignupComponent {
  @service router;
  @service store;
  @service('sweet-alert') alert;
  @service currentUser;
  @service errorHandling;
  @tracked errorMessage = null;
  @tracked username = '';
  @tracked password = '';
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked email = '';
  @tracked org = null;
  @tracked location = '';
  @tracked isAuthorized = null;
  @tracked authorizedBy = '';
  newUserData = {};
  @tracked actingRole = null;
  orgReq = null;
  @tracked missingAccountType = false;

  get accountTypes() {
    return this.currentUser.isAdmin
      ? ['Teacher', 'Student', 'Pd Admin', 'Admin']
      : ['Teacher', 'Student'];
  }
  

  get createOrgErrors() {
    return this.errorHandling.getErrors('createOrgErrors')
  }

  get createUserErrors() {
    return this.errorHandling.getErrors('createUserErrors')
  }

  async createNewUser(data) {
    if (!data) {
      throw new Error('Invalid data');
    }

    try {
      let response = await fetch('/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let error = await response.text(); // or `await response.json()` if JSON
        throw new Error(error);
      }

      return await response.json(); // adjust based on actual response type
    } catch (err) {
      throw err;
    }
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
          createdBy: that.currentUser.user,
        });

        rec
          .save()
          .then((newOrg) => {
            return resolve(newOrg.id);
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, 'createOrgErrors', rec);
            return reject(err);
          });
      } else {
        return resolve(org.id);
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
      this.org || (await this.currentUser.user.organization);
    var location = this.location;
    var accountType = this.selectedType || 'student';
    var accountTypeLetter;
    if (accountType) {
      accountTypeLetter = accountType.charAt(0).toUpperCase();
    } else {
      this.missingAccountType = true;
      return;
    }
    var isAuthorized = this.isAuthorized;
    var currentUserId = this.currentUser.id;

    if (!username || !password) {
      this.errorMessage = true;
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
        username,
        password,
        firstName,
        lastName,
        email,
        location,
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
              this.errorHandling.handleErrors(res.message, 'createUserErrors');
            }
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, 'createUserErrors', newUserData);
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

  @action
  setAccountType (type) {
    this.selectedType = type;
  }

  @action
  resetError(errorType) {
    this.errorHandling.removeMessages(errorType)
  }

  @action
  removeErrorFromArray(type, error) {
    this.errorHandling.removeErrorFromArray(type, error);
  }

}
