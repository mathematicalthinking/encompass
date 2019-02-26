Encompass.ImportWorkStep3Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step3',

  didReceiveAttrs() {
    if (this.get('existingAnswers')) {
      this.set('existingAnswers', []);
    }

    if (!this.get('uploadedFiles')) {
      this.set('uploadedFiles', []);
    }

    this._super(...arguments);

  },

  actions: {
    next() {
      if (this.get('uploadedFiles.length') > 0) {
        this.get('onProceed')(this.get('uploadedFiles'));
      } else {
        this.set('missingFiles', true);
      }
    },

    back() {
      this.get('onBack')(-1);
    },

    updateCurrentFiles(files) {
      if (!files) {
        return;
      }

      for (let f of files) {
        this.get('uploadedFiles').addObject(f);
      }
    },

    removeFile(file) {
      if (!file) {
        return;
      }
      this.get('uploadedFiles').removeObject(file);

      // destroy unnecessary image record

      let peeked = this.get('store').peekRecord('image', file._id);
      if (peeked) {
        peeked.destroyRecord();
      }
    }
  }
});

