Encompass.UsersComponent = Ember.Component.extend({
  tagName: 'users',
  classNameBindings: ['isSmallHeader:small', 'isHidden:hide'],
 
  actions: {
    largeHeader: function () {
      this.set('isSmallHeader', false)
    },
    smallHeader: function () {
      this.set('isSmallHeader', true)
    }
  }
})
