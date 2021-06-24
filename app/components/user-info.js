Encompass.UserInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'user-info',
  alert: Ember.inject.service('sweet-alert'),
  utils: Ember.inject.service('utility-methods'),
  basePermissions: Ember.inject.service('edit-permissions'),

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
    let user = this.get('user');
    if (user.get('sections')) {
      this.getUserSections();
    }
    this.set('org', null);
    this.removeMessages('updateRecordErrors', 'createRecordErrors', 'findRecordErrors');

    this.store.findAll('organization').then((orgs) => {
      this.set('orgList', orgs);
      this.removeMessages('loadOrgErrors');
    }).catch((err) => {
      this.handleErrors(err, 'loadOrgsErrors');
    });
  },

  canEdit: Ember.computed('user.id', function () {
    let user = this.get('user');
    let currentUser = this.get('currentUser');

    if (!user || !currentUser) {
      return;
    }

    // is Admin
    if (this.get('basePermissions.isActingAdmin')) {
      return true;
    }

    // is self
    if (user.get('id') === currentUser.get('id')) {
      return true;
    }

    let creatorId = this.get('utils').getBelongsToId(user, 'createdBy');

    // is creator
    if (currentUser.get('id') === creatorId) {
      return true;
    }

    // pd admin for user's org
    if (this.get('basePermissions').isRecordInPdDomain(user)) {
      return true;
    }
    return false;
  }),

  canConfirm: Ember.computed('user.id', function () {

    if (this.get('basePermissions.isActingAdmin')) {
      return true;
    }
    if (this.get('basePermissions').isRecordInPdDomain(this.get('user'))) {
      return true;
    }
    return false;
  }),

  unconfirmedEmail: Ember.computed('user.id', function () {
    return !this.get('user.isEmailConfirmed');
  }),

  getUserSections: function () {
    let user = this.get('user');
    let sections = user.get('sections');

    if (sections) {
      let sectionIds = sections.map((section) => {
        return section.sectionId;
      });

      this.get('store').query('section', {
        ids: sectionIds
      }).then((sections) => {
        this.set('userSections', sections);
      });
    }
  }.observes('user.id'),

  removeSuccessMessages: function() {
    const succesStates = ['resetPasswordSuccess'];

    for (let state of succesStates) {
      if (this.get(state)) {
        this.set(state, false);
      }
    }
  }.observes('isResettingPassword', 'isEditing', 'user.id'),

  accountTypes: Ember.computed(function () {
    let accountType = this.get('currentUser').get('accountType');
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

  lastSeenDate: function () {
      var last = this.get('lastSeen');
      if (last) {
        return moment(last).fromNow();
      }
      return 'never';
    }.property('lastSeen'),

    tourDate: function () {
      var date = this.get('seenTour');
      if (date) {
        return moment(date).fromNow();
      }
      return 'no';
    }.property('user.seenTour'),

    authorizedBy: function () {
      let isAuth = this.get('user.isAuthorized');
      let authBy = this.get('user.authorizedBy.content');
      if (isAuth && !authBy) {
        let user = this.get('user');
        user.set('authorizedBy', this.get('currentUser'));
        user.set('shouldSendAuthEmail', true);
      }
    }.observes('user.isAuthorized'),

    actions: {
      editUser: function () {
        let user = this.get('user');
        this.set('userEmail', user.get('email'));
        let accountType = user.get('accountType');
        if (accountType === "S") {
          this.set('selectedType', 'Student');
        } else if (accountType === "T") {
          this.set('selectedType', 'Teacher');
        } else if (accountType === "A") {
          this.set('selectedType', 'Admin');
        } else if (accountType === "P") {
          this.set('selectedType', 'Pd Admin');
        } else {
          this.set('selectedType', 'null');
        }
        this.set('isEditing', true);
        let isAuth = user.get('isAuthorized');
        this.set('authorized', isAuth);
      },

      checkOrgExists: function () {
        let user = this.get('user');
        let userOrg = user.get('organization').get('content');
        let userOrgRequest = user.get('organizationRequest');
        let org = this.get('org');
        let orgReq = this.get('orgReq');

        let options = [Boolean(userOrg), Boolean(userOrgRequest), Boolean(org), Boolean(orgReq)];

        if (options.includes(true)) {
          this.send('saveUser');
        } else {
          this.get('alert').showModal('warning', 'Are you sure you want to save a user that has no organization?', 'Users should belong to an organization to improve the EnCoMPASS experience', 'Yes')
            .then((result) => {
              if (result.value) {
                this.send('saveUser');
              }
            });
        }
      },

      saveUser: function () {
        let currentUser = this.get('currentUser');
        let user = this.get('user');
        let org = this.get('org');
        let orgReq = this.get('orgReq');

        let orgs = this.get('orgList');
        let matchingOrg = orgs.findBy('name', orgReq);
        if (matchingOrg) {
          org = matchingOrg;
          orgReq = null;
        }

        // should we check to see if any information was actually updated before updating modified by/date?
        let accountType = this.get('selectedType');
        let accountTypeLetter = accountType.charAt(0).toUpperCase();
        user.set('accountType', accountTypeLetter);

        if (org) {
          user.set('organization', org);
          user.save();
        }
        if (orgReq) {
          user.set('organizationRequest', orgReq);
        }
        user.set('email', this.get('userEmail'));


      //if is authorized is now true, then we need to set the value of authorized by to current user
        if (user.get('hasDirtyAttributes')) {
          let newDate = new Date();
          user.set('lastModifiedBy', currentUser);
          user.set('lastModifiedDate', newDate);

          // so server knows whether to make request to sso server
          user.set('isConfirmingEmail', this.get('isConfirmingEmail'));

          user.save().then(() => {
            this.get('alert').showToast('success', 'User updated', 'bottom-end', 3000, false, null);
            this.set('isEditing', false);
            this.removeMessages('updateRecordErrors');
          }).catch((err) => {
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

      resetPassword: function() {
        this.set('isResettingPassword', true);
        Ember.run.later(() => {
          $('html, body').animate({
            scrollTop: $(document).height()
          });
        }, 100);
      },

      authEmail: function() {
        this.set('willOveride', true);
      },

      confirmOrgModal: function () {
        let user = this.get('user');
        let reqOrg = user.get('organizationRequest');
        this.get('alert').showModal('question', `Are you sure you want to create a new organization?`, `This will create a brand new organization called ${reqOrg}`, 'Yes')
        .then((result) => {
          if (result.value) {
            this.send('createNewOrg');
          }
        });
      },

      createNewOrg: function () {
        let user = this.get('user');
        let currentUser = this.get('currentUser');
        let reqOrg = user.get('organizationRequest');
        let newOrg = this.store.createRecord('organization', {
          name: reqOrg,
          createdBy: currentUser
        });
        newOrg.save()
          .then((org) => {
            this.removeMessages('createRecordErrors');
            let user = this.get('user');
            let orgName = org.get('name');
            user.set('organization', org);
            this.set('orgReq', null);
            user.set('organizationRequest', null);
            user.save().then((user) => {
              this.get('alert').showToast('success', `${orgName} Created`, 'bottom-end', 3000, false, null);
              this.set('orgModal', false);
              this.removeMessages('updateRecordErrors');
            }).catch((err) => {
              this.handleErrors(err, 'updateRecordErrors', user);
            });
          }).catch((err) => {
            this.handleErrors(err, 'createRecordErrors', newOrg);
          });
      },

      removeOrg: function () {
        let user = this.get('user');
        user.set('organizationRequest', null);
        user.save().then((res) => {
          // handle success
          this.removeMessages('updateRecordErrors');
        }).catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', user);
        });
      },

      deleteUser: function () {
        let user = this.get('user');
        let username = user.get('username');
        this.get('alert').showModal('warning', `Are you sure want to delete ${username}?`, 'You can always restore this user later', 'Delete').then((result) => {
          if (result.value) {
            user.set('isTrashed', true);
            user.save().then(() => {
              this.get('alert').showToast('success', `${username} successfully deleted`, 'bottom-end', 4000, true, 'Undo')
              .then((result) => {
                if (result.value) {
                  user.set('isTrashed', false);
                  user.save().then(() => {
                    this.get('alert').showToast('success', `${username} successfully restored`, 'bottom-end', 3000, false, null);
                  });
                }
              });
            });
          }
        });
      },

      restoreUser: function () {
        let user = this.get('user');
        let username = user.get('username');
        this.get('alert').showModal('question', `Are you sure want to restore ${username}?`, null, 'Yes')
        .then((result) => {
          if (result.value) {
            user.set('isTrashed', false);
            user.save().then(() => {
              this.get('alert').showToast('success', `${username} successfully restored`, 'bottom-end', 4000, true, 'Undo');
            });
          }
        });
      },

      cancel: function () {
        this.set('isEditing', false);
        this.set('noOrgModal', false);
      },

      handleCancelForm: function() {
        this.set('isResettingPassword', false);
      },

      handleResetSuccess: function(updatedUser) {
        const user = this.get('user');

        return this.store.findRecord('user', user.id).then((user) => {
          this.set('user', user);
          this.set('isResettingPassword', false);
          this.set('resetPasswordSuccess', true);
          this.removeMessages('findRecordErrors');
        }).catch((err) => {
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
        let user = this.get('user');

        if (user) {
          let isConfirmingEmail = !user.get('isEmailConfirmed');

          this.set('isConfirmingEmail', isConfirmingEmail);
          user.toggleProperty('isEmailConfirmed');
        }
      }
    }
});

