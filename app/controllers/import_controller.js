Encompass.ImportController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  isCompDirty: false,
  confirmLeaving: false,

  actions: {
    doConfirmLeaving: function (value) {
      this.set('confirmLeaving', value);
    }
  }
});