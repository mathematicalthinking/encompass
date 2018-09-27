Encompass.ImportController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  isCompDirty: false,
  confirmLeaving: false,

  actions: {
    doConfirmLeaving: function (value) {
      console.log('in controller dcl', value);
      this.set('confirmLeaving', value);
    }
  }
});