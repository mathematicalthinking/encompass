import Component from '@ember/component';

export default Component.extend({
  elementId: 'import-work-step3',

  actions: {
    next() {
      if (this.get('uploadedFiles.length') > 0) {
        this.onProceed(this.uploadedFiles);
      } else {
        this.set('missingFiles', true);
      }
    },

    back() {
      this.onBack(-1);
    },

    updateCurrentFiles(files) {
      if (!files) {
        return;
      }

      for (let f of files) {
        this.uploadedFiles.addObject(f);
      }
    },

    removeFile(file) {
      if (!file) {
        return;
      }
      this.uploadedFiles.removeObject(file);

      // destroy unnecessary image record
      const fileId =
        file.id ||
        file._id ||
        (typeof file.get === 'function' ? file.get('id') : null);
      if (!fileId) {
        return;
      }
      let peeked = this.store.peekRecord('image', fileId);
      if (peeked) {
        peeked.destroyRecord();
      }
    },
  },
});
