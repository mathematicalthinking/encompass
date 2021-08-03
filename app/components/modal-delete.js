import Component from '@ember/component';






export default Component.extend({
  elementId: 'modal-delete',
  actions: {
    delete: function () {
      this.sendAction('onConfirm', this.itemToDelete);
    },

    cancel: function () {
      this.set('itemToDelete', null);
    }
  }
});