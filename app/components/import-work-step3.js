import Component from '@ember/component';

export default Component.extend({
  elementId: 'import-work-step3',

  didReceiveAttrs() {
    if (this.existingAnswers) {
      this.set('existingAnswers', []);
    }

    // if (!this.uploadedFiles) {
    //   this.set('uploadedFiles', []);
    // }

    this._super(...arguments);
  },

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

      let peeked = this.store.peekRecord('image', file._id);
      if (peeked) {
        peeked.destroyRecord();
      }
    },
  },
});
