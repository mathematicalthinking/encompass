import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import moment from 'moment';

export default class UserInfoComponent extends Component {
  @service('sweet-alert') alert;
  @service('utility-methods') utils;
  @service('error-handling') errorHandling;
  @service('edit-permissions') basePermissions;
  @service currentUser;
  @service store;

  @tracked isEditing = false;
  @tracked isResettingPassword = false;
  @tracked user = null;

  get loadOrgsErrors() {
    return this.errorHandling.getErrors('loadOrgsErrors');
  }

  get updateRecordErrors() {
    return this.errorHandling.getErrors('updateRecordErrors');
  }

  get createRecordErrors() {
    return this.errorHandling.getErrors('createRecordErrors');
  }

  get findRecordErrors() {
    return this.errorHandling.getErrors('findRecordErrors');
  }

  get noEmail() {
    return !this.args.user.email;
  }

  get canEdit() {
    const user = this.args.user;
    if (!user) return false;

    const creatorId = this.utils.getBelongsToId(user, 'createdBy');

    // can edit if:
    // - current user is an admin
    // - current user is editing their own profile
    // - current user is the creator of the user
    // - current user is a PD admin for the user's org
    return (
      this.currentUser.isAdmin ||
      user.id === this.currentUser.id ||
      creatorId === this.currentUser.id ||
      this.basePermissions.isRecordInPdDomain(user)
    );
  }

  get canConfirm() {
    return (
      this.currentUser.isActingAdmin ||
      this.basePermissions.isRecordInPdDomain(this.args.user)
    );
  }

  get accountTypes() {
    if (this.currentUser.isAdmin) {
      return ['Teacher', 'Student', 'Pd Admin', 'Admin'];
    } else if (this.currentUser.isPdAdmin) {
      return ['Teacher', 'Student'];
    } else if (this.currentUser.isTeacher) {
      return ['Student'];
    } else {
      return [];
    }
  }

  get seenTour() {
    return this.user?.seenTour ?? this.args.user.seenTour;
  }

  get tourDate() {
    var date = this.args.user.seenTour;
    if (date) {
      return moment(date).fromNow();
    }
    return 'No';
  }

  @action
  editUser() {
    this.isEditing = true;
    this.user = this.extractEditableProperties(this.args.user);
  }

  @action
  handleCancelEdit() {
    this.isEditing = false;
    this.user = this.extractEditableProperties(this.args.user);
  }

  @action
  handleSave() {
    this.checkOrgExists();
  }

  @action
  handleChange(property, value) {
    this.user = { ...this.user, [property]: value };
  }

  @action
  handleAccountTypeChange(value) {
    this.handleChange('accountType', value[0]);
  }

  @action checkOrgExists() {
    let user = this.user;
    let userOrg = user.organization?.content;
    let userOrgRequest = user.organizationRequest;
    let org = this.org;
    let orgReq = this.orgReq;

    if (userOrg || userOrgRequest || org || orgReq) {
      this.saveUser();
    } else {
      this.alert
        .showModal(
          'warning',
          'Are you sure you want to save a user that has no organization?',
          'Users should belong to an organization to improve the EnCoMPASS experience',
          'Yes'
        )
        .then((result) => {
          if (result.value) {
            this.saveUser();
          }
        });
    }
  }

  saveUser() {
    const user = this.args.user;

    // set the isConfirmingEmail flag if the current user has manually confirmed this user's email
    // so server knows whether to make request to sso server
    user.isConfirmingEmail =
      this.user.isEmailConfirmed && !user.isEmailConfirmed;

    // update user with the values from the properties in this.user
    Object.keys(this.user).forEach((key) => {
      user.set(key, this.user[key]);
    });

    const org = this.org;
    const orgReq = this.orgReq;

    let orgs = this.args.orgList;
    let matchingOrg = orgs.findBy('name', orgReq);
    if (matchingOrg) {
      this.org = matchingOrg;
      this.orgReq = null;
    }

    if (org) {
      user.org = org;
    }
    if (orgReq) {
      user.organizationRequest = orgReq;
    }

    //if is authorized is now true, then we need to set the value of authorized by to current user
    user.lastModifiedBy = this.currentUser.user;
    user.lastModifiedDate = new Date();

    user
      .save()
      .then(() => {
        this.alert.showToast(
          'success',
          'User updated',
          'bottom-end',
          3000,
          false,
          null
        );
        this.errorHandling.removeMessages('updateRecordErrors');
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'updateRecordErrors', user);
      });
    this.isEditing = false;
  }

  @action initSave() {
    return this.saveUser();
  }

  @action setOrg(org) {
    if (typeof org === 'string') {
      this.orgReq = org;
    } else {
      this.org = org;
    }
  }

  @action
  resetPassword() {
    this.isResettingPassword = true;
  }

  @action confirmOrgModal() {
    let user = this.args.user;
    let reqOrg = user.get('organizationRequest');
    this.alert
      .showModal(
        'question',
        `Are you sure you want to create a new organization?`,
        `This will create a brand new organization called ${reqOrg}`,
        'Yes'
      )
      .then((result) => {
        if (result.value) {
          this.send('createNewOrg');
        }
      });
  }

  @action createNewOrg() {
    let user = this.args.user;
    let reqOrg = user.get('organizationRequest');
    let newOrg = this.store.createRecord('organization', {
      name: reqOrg,
      createdBy: this.currentUser.user,
    });
    newOrg
      .save()
      .then((org) => {
        this.errorHandling.removeMessages('createRecordErrors');
        let user = this.args.user;
        let orgName = org.get('name');
        user.set('organization', org);
        this.orgReq = null;
        user.set('organizationRequest', null);
        user
          .save()
          .then(() => {
            this.alert.showToast(
              'success',
              `${orgName} Created`,
              'bottom-end',
              3000,
              false,
              null
            );
            this.orgModal = false;
            this.errorHandling.removeMessages('updateRecordErrors');
          })
          .catch((err) => {
            this.errorHandling.handleErrors(err, 'updateRecordErrors', user);
          });
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'createRecordErrors', newOrg);
      });
  }

  @action removeOrg() {
    let user = this.args.user;
    user.set('organizationRequest', null);
    user
      .save()
      .then(() => {
        // handle success
        this.errorHandling.removeMessages('updateRecordErrors');
      })
      .catch((err) => {
        this.errorHandling.handleErrors(err, 'updateRecordErrors', user);
      });
  }

  @action deleteUser() {
    let user = this.args.user;
    let username = user.get('username');
    this.alert
      .showModal(
        'warning',
        `Are you sure want to delete ${username}?`,
        'You can always restore this user later',
        'Delete'
      )
      .then((result) => {
        if (result.value) {
          user.isTrashed = true;
          user.save().then(() => {
            this.alert
              .showToast(
                'success',
                `${username} successfully deleted`,
                'bottom-end',
                4000,
                true,
                'Undo'
              )
              .then((result) => {
                if (result.value) {
                  user.set('isTrashed', false);
                  user.save().then(() => {
                    this.alert.showToast(
                      'success',
                      `${username} successfully restored`,
                      'bottom-end',
                      3000,
                      false,
                      null
                    );
                  });
                }
              });
          });
        }
      });
  }

  @action restoreUser() {
    let user = this.args.user;
    let username = user.get('username');
    this.alert
      .showModal(
        'question',
        `Are you sure want to restore ${username}?`,
        null,
        'Yes'
      )
      .then((result) => {
        if (result.value) {
          user.set('isTrashed', false);
          user.save().then(() => {
            this.alert.showToast(
              'success',
              `${username} successfully restored`,
              'bottom-end',
              4000,
              true,
              'Undo'
            );
          });
        }
      });
  }

  @action cancel() {
    this.isEditing = false;
    this.noOrgModal = false;
    this.isResettingPassword = false;
  }

  @action handleCancelForm() {
    this.isResettingPassword = false;
  }

  @action handleResetSuccess() {
    this.isResettingPassword = false;
    this.resetPasswordSuccess = true;
    this.errorHandling.removeMessages('findRecordErrors');
    this.args.refresh();
  }

  @action
  clearTour() {
    this.handleChange('seenTour', null);
  }

  @action
  doneTour() {
    this.handleChange('seenTour', new Date());
  }

  extractEditableProperties(user) {
    return {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isEmailConfirmed: user.isEmailConfirmed,
      organizationRequest: user.organizationRequest,
      location: user.location,
      accountType: user.accountType,
      organization: user.organization,
      isAuthorized: user.isAuthorized,
      isTrashed: user.isTrashed,
      seenTour: user.seenTour,
    };
  }
}
