Encompass.UserInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-info',
  isEditing: false,
  authorized: null,

  // this was returning undefined if you are logged in and viewing your own profile and
  // your account does not have a createdBy
  // should teachers who sign up through the site themselves have createdBy be set to their own id?
  canEdit: Ember.computed('user.id', function () {
    let user = this.get('user');
    console.log('user is', user);
    let creator = user.get('createdBy.content.id');
    console.log('creator id is', creator);
    let currentUserId = this.get('currentUser').get('id');
    console.log('currentUserId is', currentUserId);
    let accountType = this.get('currentUser').get('accountType');
    let isAdmin = accountType === 'A';

<<<<<<< HEAD
    let canEdit = (creator === currentUserId ? true : false) || isAdmin;
=======
    if (currentUserId === user.id) {
      return true;
    }
    let canEdit = (creator === currentUserId ? true : false) || this.get('currentUser').get('isAdmin');
>>>>>>> Add functionality to reset a user's password from their user info page
    return canEdit;
  }),

  removeSuccessMessages: function() {
    const succesStates = ['resetPasswordSuccess'];

    for (let state of succesStates) {
      if (this.get(state)) {
        this.set(state, false);
      }
    }
  }.observes('isResettingPassword', 'isEditing', 'user.id'),

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
      let authBy = this.get('user.authorizedBy');
      if (isAuth && !authBy) {
        let user = this.get('user');
        user.set('authorizedBy', this.get('currentUser'));
      }
    }.observes('user.isAuthorized'),

    actions: {
      editUser: function () {
        this.set('isEditing', true);
        let user = this.get('user');
        let isAuth = user.get('isAuthorized');
        this.set('authorized', isAuth);
      },

      saveUser: function () {
        let currentUser = this.get('currentUser');
        let newDate = new Date();
        let user = this.get('user');

        // should we check to see if any information was actually updated before updating modified by/date?
        user.set('lastModifiedBy', currentUser);
        user.set('lastModifiedDate', newDate);

      //if is authorized is now true, then we need to set the value of authorized by to current user
        user.save();
        this.set('isEditing', false);
      },
      resetPassword: function() {
        this.set('isResettingPassword', true);
      },

      handleResetSuccess: function(userResponse) {
        const user = this.get('user');
        const currentUser = this.get('currentUser');
        console.log('user in hrs', userResponse);

        user.set('lastModifiedBy', currentUser);
        user.set('lastModifiedDate', new Date());
        user.save().then((user) => {
          this.set('isResettingPassword', false);
          this.set('resetPasswordSuccess', true);
          return;
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

