Encompass.ImportWorkStep3Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step3',

  actions: {
    next() {
      const uploadedFiles = this.get('uploadedFiles');
      console.log('uploadedFiles are', uploadedFiles);
      // workspace is required to go to next step
      if (uploadedFiles.length >= 1) {
        console.log('the length is greater than one');
        this.get('onProceed')();
        return;
      }
      this.set('missingFiles', true);

    },
    back() {
      this.get('onBack')(-1);
    }
  }
});