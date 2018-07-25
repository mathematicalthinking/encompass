Encompass.TopBarComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  tagName: 'header',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
  elementId: 'al_header',
  isSmallHeader: false,
  isHidden: false,
  isStudent: null,
  notStudent: null,
  openMenu: false,


  didReceiveAttrs: function() {
    let currentUser = this.get('currentUser');
    let isStudent = currentUser.get('isStudent');
    if (isStudent) {
      this.set('isStudent', true);
      this.set('notStudent', false);
    } else {
      this.set('isStudent', false);
      this.set('notStudent', true);
    }
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
    }
  }
});

