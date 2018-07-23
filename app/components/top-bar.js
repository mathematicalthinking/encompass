Encompass.TopBarComponent = Ember.Component.extend({
  tagName: 'header',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
  elementId: 'al_header',
  isSmallHeader: false,
  isHidden: false,
  isStudent: false,
  openMenu: false,

  actions: {
    largeHeader: function() {
      this.set('isSmallHeader', false);
    },
    smallHeader: function() {
      this.set('isSmallHeader', true);
    },
    toggleMenu: function() {
      console.log('toggle called', this.openMenu);
    }
  }
});

