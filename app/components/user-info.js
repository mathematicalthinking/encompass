import Component from '@ember/component';
import { computed, observer } from '@ember/object';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import $ from 'jquery';
import moment from 'moment';
import ErrorHandlingMixin from '../mixins/error_handling_mixin';

export default Component.extend(ErrorHandlingMixin, {
  elementId: 'user-info',
  alert: service('sweet-alert'),
  utils: service('utility-methods'),
  basePermissions: service('edit-permissions'),

  isEditing: false,
  authorized: null,
  selectedType: null,
  willOveride: null,
  fieldType: 'password',
  loadOrgsErrors: [],
  updateRecordErrors: [],
  createRecordErrors: [],
  findRecordErrors: [],

  // this was returning undefined if you are logged in and viewing your own profile and
  // your account does not have a createdBy
  // should teachers who sign up through the site themselves have createdBy be set to their own id?

  didReceiveAttrs: function () {
    this.set('isEditing', false);
    let user = this.user;
    if (user.sections) {
      this.getUserSections();
    }
    this.set('org', null);
    this.removeMessages(
      'updateRecordErrors',
      'createRecordErrors',
      'findRecordErrors'
    );

    this.store
      .findAll('organization')
      .then((orgs) => {
        this.set('orgList', orgs);
        this.removeMessages('loadOrgErrors');
      })
      .catch((err) => {
        this.handleErrors(err, 'loadOrgsErrors');
      });
  },

  canEdit: computed('user.id', function () {
    let user = this.user;
    let currentUser = this.currentUser;
    if (!user || !currentUser) {
      return;
    }

    // is Admin
    if (this.currentUser.accountType === 'A') {
      return true;
    }

    // is self
    if (user.get('id') === currentUser.get('id')) {
      return true;
    }

    let creatorId = this.utils.getBelongsToId(user, 'createdBy');

    // is creator
    if (currentUser.get('id') === creatorId) {
      return true;
    }

    // pd admin for user's org
    if (this.basePermissions.isRecordInPdDomain(user)) {
      return true;
    }
    return false;
  }),

  canConfirm: computed('user.id', function () {
    if (this.basePermissions.isActingAdmin) {
      return true;
    }
    if (this.basePermissions.isRecordInPdDomain(this.user)) {
      return true;
    }
    return false;
  }),

  unconfirmedEmail: computed('user.id', function () {
    return !this.user.isEmailConfirmed;
  }),

  getUserSections: observer('user.id', function () {
    let user = this.user;
    let sections = user.get('sections');

    if (sections) {
      let sectionIds = sections.map((section) => {
        return section.sectionId;
      });

      this.store
        .query('section', {
          ids: sectionIds,
        })
        .then((sections) => {
          this.set('userSections', sections);
        });
    }
  }),

  removeSuccessMessages: observer(
    'isResettingPassword',
    'isEditing',
    'user.id',
    function () {
      const succesStates = ['resetPasswordSuccess'];

      for (let state of succesStates) {
        if (this.get(state)) {
          this.set(state, false);
        }
      }
    }
  ),

  accountTypes: computed(function () {
    let accountType = this.currentUser.get('accountType');
    let accountTypes;

    if (accountType === 'A') {
      accountTypes = ['Teacher', 'Student', 'Pd Admin', 'Admin'];
    } else if (accountType === 'P') {
      accountTypes = ['Teacher', 'Student'];
    } else if (accountType === 'T') {
      accountTypes = ['Student'];
    } else {
      accountTypes = [];
    }

    return accountTypes;
  }),

  lastSeenDate: computed('lastSeen', function () {
    var last = this.lastSeen;
    if (last) {
      return moment(last).fromNow();
    }
    return 'never';
  }),

  tourDate: computed('user.seenTour', function () {
    var date = this.seenTour;
    if (date) {
      return moment(date).fromNow();
    }
    return 'no';
  }),

  authorizedBy: observer('user.isAuthorized', function () {
    let isAuth = this.user.isAuthorized;
    let authBy = this.user.authorizedBy.content;
    if (isAuth && !authBy) {
      let user = this.user;
      user.set('authorizedBy', this.currentUser);
      user.set('shouldSendAuthEmail', true);
    }
  }),

  actions: {
    editUser: function () {
      let user = this.user;
      this.set('userEmail', user.email);
      let accountType = user.get('accountType');
      if (accountType === 'S') {
        this.set('selectedType', 'Student');
      } else if (accountType === 'T') {
        this.set('selectedType', 'Teacher');
      } else if (accountType === 'A') {
        this.set('selectedType', 'Admin');
      } else if (accountType === 'P') {
        this.set('selectedType', 'Pd Admin');
      } else {
        this.set('selectedType', 'null');
      }
      this.set('isEditing', true);
      let isAuth = user.get('isAuthorized');
      this.set('authorized', isAuth);
    },

    checkOrgExists: function () {
      let user = this.user;
      let userOrg = user.get('organization').get('content');
      let userOrgRequest = user.get('organizationRequest');
      let org = this.org;
      let orgReq = this.orgReq;

      let options = [
        Boolean(userOrg),
        Boolean(userOrgRequest),
        Boolean(org),
        Boolean(orgReq),
      ];

      if (options.includes(true)) {
        this.send('saveUser');
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
              this.send('saveUser');
            }
          });
      }
    },

    saveUser: function () {
      let currentUser = this.currentUser;
      let user = this.user;
      let org = this.org;
      let orgReq = this.orgReq;

      let orgs = this.orgList;
      let matchingOrg = orgs.findBy('name', orgReq);
      if (matchingOrg) {
        org = matchingOrg;
        orgReq = null;
      }

      // should we check to see if any information was actually updated before updating modified by/date?
      let accountType = this.selectedType;
      let accountTypeLetter = accountType.charAt(0).toUpperCase();
      user.set('accountType', accountTypeLetter);

      if (org) {
        user.set('organization', org);
      }
      if (orgReq) {
        user.set('organizationRequest', orgReq);
      }
      user.set('email', this.userEmail);

      //if is authorized is now true, then we need to set the value of authorized by to current user
      if (user.get('hasDirtyAttributes')) {
        let newDate = new Date();
        user.set('lastModifiedBy', currentUser);
        user.set('lastModifiedDate', newDate);

        // so server knows whether to make request to sso server
        user.set('isConfirmingEmail', this.isConfirmingEmail);

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
            this.set('isEditing', false);
            this.removeMessages('updateRecordErrors');
          })
          .catch((err) => {
            this.handleErrors(err, 'updateRecordErrors', user);
          });
      }
      this.set('isEditing', false);
    },

    setOrg(org) {
      if (typeof org === 'string') {
        this.set('orgReq', org);
      } else {
        this.set('org', org);
      }
    },

    resetPassword: function () {
      this.set('isResettingPassword', true);
      later(() => {
        $('html, body').animate({
          scrollTop: $(document).height(),
        });
      }, 100);
    },

    authEmail: function () {
      this.set('willOveride', true);
    },

    confirmOrgModal: function () {
      let user = this.user;
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
    },

    createNewOrg: function () {
      let user = this.user;
      let currentUser = this.currentUser;
      let reqOrg = user.get('organizationRequest');
      let newOrg = this.store.createRecord('organization', {
        name: reqOrg,
        createdBy: currentUser,
      });
      newOrg
        .save()
        .then((org) => {
          this.removeMessages('createRecordErrors');
          let user = this.user;
          let orgName = org.get('name');
          user.set('organization', org);
          this.set('orgReq', null);
          user.set('organizationRequest', null);
          user
            .save()
            .then((user) => {
              this.alert.showToast(
                'success',
                `${orgName} Created`,
                'bottom-end',
                3000,
                false,
                null
              );
              this.set('orgModal', false);
              this.removeMessages('updateRecordErrors');
            })
            .catch((err) => {
              this.handleErrors(err, 'updateRecordErrors', user);
            });
        })
        .catch((err) => {
          this.handleErrors(err, 'createRecordErrors', newOrg);
        });
    },

    removeOrg: function () {
      let user = this.user;
      user.set('organizationRequest', null);
      user
        .save()
        .then((res) => {
          // handle success
          this.removeMessages('updateRecordErrors');
        })
        .catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', user);
        });
    },

    deleteUser: function () {
      let user = this.user;
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
            user.set('isTrashed', true);
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
    },

    restoreUser: function () {
      let user = this.user;
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
    },

    cancel: function () {
      this.set('isEditing', false);
      this.set('noOrgModal', false);
    },

    handleCancelForm: function () {
      this.set('isResettingPassword', false);
    },

    handleResetSuccess: function (updatedUser) {
      const user = this.user;

      return this.store
        .findRecord('user', user.id)
        .then((user) => {
          this.set('user', user);
          this.set('isResettingPassword', false);
          this.set('resetPasswordSuccess', true);
          this.removeMessages('findRecordErrors');
        })
        .catch((err) => {
          this.handleErrors(err, 'findRecordErrors');
        });
    },

    clearTour: function () {
      this.set('user.seenTour', null);
    },

    doneTour: function () {
      this.set('user.seenTour', new Date());
    },
    onManualConfirm() {
      // clicked manual confirm email box
      let user = this.user;

      if (user) {
        let isConfirmingEmail = !user.get('isEmailConfirmed');

        this.set('isConfirmingEmail', isConfirmingEmail);
        user.toggleProperty('isEmailConfirmed');
      }
    },
  },
});
