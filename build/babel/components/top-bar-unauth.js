'use strict';

Encompass.TopBarComponent = Ember.Component.extend({
  tagName: 'header',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
  elementId: 'al_header',
  isSmallHeader: false,
  isHidden: false,

  actions: {
    largeHeader: function largeHeader() {
      this.set('isSmallHeader', false);
    },
    smallHeader: function smallHeader() {
      this.set('isSmallHeader', true);
    }
  }
});
//# sourceMappingURL=top-bar-unauth.js.map
