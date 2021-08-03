import Component from '@ember/component';






export default Component.extend({
  elementId: 'modal-confirm',

  actions: {
    confirm: function () {
      this.sendAction('onConfirm', this.actionToConfirm);
    },

    cancel: function () {
      this.set('actionToConfirm', null);
    }
  }
});