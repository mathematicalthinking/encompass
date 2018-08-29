Encompass.TopBarComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'header',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
  elementId: 'al_header',
  isSmallHeader: false,
  isHidden: false,
  openMenu: false,

  isStudent: function() {
    return this.user.get('isStudent') || this.user.get('actingRole') === 'student';
  }.property('user.actingRole', 'user.id'),

  notStudent: Ember.computed.not('isStudent'),


  didReceiveAttrs: function() {
    let currentUser = this.get('currentUser');
    let isStudent = this.get('isStudent');
    this.set('isStudentAccount', currentUser.get('accountType') === 'S');
    // if (isStudent) {
    //   this.set('isStudent', true);
    //   this.set('notStudent', false);
    // } else {
    //   this.set('isStudent', false);
    //   this.set('notStudent', true);
    // }
  },

  actions: {
    largeHeader: function() {
      this.set('isSmallHeader', false);
    },
    smallHeader: function() {
      this.set('isSmallHeader', true);
    },
    toggleMenu: function () {
      console.log('toggle called', this.openMenu);
    },
    toggleActingRole: function() {
      const currentUser = this.get('currentUser');

      // student account types cannot toggle to teacher role
      if (currentUser.get('accountType') === 'S') {
        return;
      }
      const actingRole = currentUser.get('actingRole');
      if (actingRole === 'teacher') {
        currentUser.set('actingRole', 'student');
      } else {
        currentUser.set('actingRole', 'teacher');
      }
      currentUser.save().then(() => {
        this.sendAction('toHome');
      });
    }
  }
});

