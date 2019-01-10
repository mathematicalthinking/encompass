Encompass.ImportWorkStep3Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step3',

  actions: {
    next() {
      const uploadedFiles = this.get('uploadedFiles');
      if (uploadedFiles) {
        this.get('onProceed')();
      } else {
        this.set('missingFiles', true);
      }
    },

    back() {
      this.get('onBack')(-1);
    }
  }
});

