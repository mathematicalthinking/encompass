/**
 * Passed in by parent:
 * - hide
 */
import Component from '@ember/component';






export default Component.extend({
  classNameBindings: ['hide'],
  newFolderName: '',

  actions: {
    close: function () {
      this.set('newFolderName', '');
      this.set('hide', true);
    },

    cancel: function () {
      this.set('newFolderName', '');
      this.set('hide', true);
    },

    save: function () {
      var newName = this.newFolderName;
      this.sendAction("newFolder", newName);

      this.set('hide', true);
    }
  }
});

