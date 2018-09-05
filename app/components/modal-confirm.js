Encompass.ModalConfirmComponent = Ember.Component.extend({
  elementId: 'modal-confirm',

  actions: {
    confirm: function() {
      this.sendAction('onConfirm', this.get('actionToConfirm'));
    },

    cancel: function() {
      this.set('actionToConfirm', null);
    }
  }
});