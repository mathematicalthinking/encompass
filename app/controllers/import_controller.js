Encompass.ImportController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  isCompDirty: false,

  confirmLeaving: function() {
    return this.get('isCompDirty');
  }.property('isCompDirty')

});