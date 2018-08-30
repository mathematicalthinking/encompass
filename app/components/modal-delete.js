Encompass.ModalDeleteComponent = Ember.Component.extend({
  actions: {
    delete: function() {
      this.sendAction('onConfirm', this.get('itemToDelete'));
    },

    cancel: function() {
      this.set('itemToDelete', null);
    }
  }
});