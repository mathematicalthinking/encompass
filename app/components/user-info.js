Encompass.UserInfoComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'user-info',
  isEditing: false,

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

    actions: {
      editUser: function () {
        this.set('isEditing', true);
      },

      saveUser: function () {
        let currentUser = this.get('currentUser');
        let user = this.get('user');
        let newDate = new Date();
        user.set('lastModifiedBy', currentUser);
        user.set('lastModifiedDate', newDate);
        user.save();
        this.set('isEditing', false);
      },

      clearTour: function () {
        this.set('user.seenTour', null);
      },

      doneTour: function () {
        this.set('user.seenTour', new Date());
      }
    }
});

