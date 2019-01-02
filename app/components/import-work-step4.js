Encompass.ImportWorkStep4Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step4',

  actions: {
    next() {
      this.get('onProceed')();
      return;
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});