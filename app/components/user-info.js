Encompass.UserInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: 'user-info',
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
    this.set('org', null);
    this.store.findAll('organization').then((orgs) => {
      this.set('orgList', orgs);
    }).catch((err) => {
      this.handleErrors(err, 'loadOrgsErrors');
    });
  },

  canEdit: Ember.computed('user.id', function () {
    let user = this.get('user');
    if (Ember.isEmpty(user)) {
      return;
    }
    let creator = user.get('createdBy.content.id');
    let currentUserId = this.get('currentUser').get('id');
    let accountType = this.get('currentUser').get('accountType');
    let yourUsername = this.get('currentUser').get('username');
    let selectedUsername = user.get('username');

    let isOwner = yourUsername === selectedUsername;
    let isAdmin = accountType === 'A';
    let isPdAdmin = accountType === 'P';

    let canEdit = (creator === currentUserId ? true : false) || isAdmin || isPdAdmin || isOwner;
    return canEdit;
  }),

  canConfirm: Ember.computed('user.id', function () {
    let accountType = this.get('currentUser').get('accountType');
    let isAdmin = accountType === 'A';
    let isPdAdmin = accountType === 'P';

    let canConfirm = isPdAdmin || isAdmin;
    return canConfirm;
  }),

  unconfirmedEmail: Ember.computed('user.id', function () {
    let user = this.get('user');
    let emailConfirm = user.get('isEmailConfirmed');

    if (emailConfirm) {
      return false;
    } else if (!emailConfirm) {
      return true;
    }
  }),

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

      saveUser: function () {
        let currentUser = this.get('currentUser');
        let newDate = new Date();
        let user = this.get('user');
        let org = this.get('org');
        let orgReq = this.get('orgReq');

        // should we check to see if any information was actually updated before updating modified by/date?
        let accountType = this.get('selectedType');
        let accountTypeLetter = accountType.charAt(0).toUpperCase();
        user.set('lastModifiedBy', currentUser);
        user.set('lastModifiedDate', newDate);
        user.set('accountType', accountTypeLetter);

        if (org) {
          user.set('organization', org);
        }
        user.set('organizationRequest', orgReq);
        user.set('email', this.get('userEmail'));

      //if is authorized is now true, then we need to set the value of authorized by to current user
        user.save().then((res) => {
          this.set('isEditing', false);
        }).catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', user);
        });

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
      },

      authEmail: function() {
        this.set('willOveride', true);
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
            let user = this.get('user');
            user.set('organization', org);
            this.set('orgReq', null);
            user.set('organizationRequest', null);
            user.save().then((user) => {
              console.log('user', user);
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
        }).catch((err) => {
          this.handleErrors(err, 'updateRecordErrors', user);
        });
      },

      cancel: function () {
        this.set('isEditing', false);
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
        }).catch((err) => {
          this.handleErrors(err, 'findRecordErrors');
        });
      },

      clearTour: function () {
        this.set('user.seenTour', null);
      },

      doneTour: function () {
        this.set('user.seenTour', new Date());
      }
    }
});

