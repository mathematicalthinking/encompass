'use strict';

/**
 * Passed in by parent:
 * - hide
 * - folderName
 * - confirm (action)
 */
Encompass.ModalFolderDeleteComponent = Ember.Component.extend({
  classNameBindings: ['hide'],

  actions: {
    cancel: function cancel() {
      console.log("Cancelled delete folder");
      this.set('hide', true);
    },

    deleteFolder: function deleteFolder() {
      console.log("Delete folder");
      this.sendAction("confirm");
      this.set('hide', true);
    }
  }
});
//# sourceMappingURL=modal-folder-delete.js.map
