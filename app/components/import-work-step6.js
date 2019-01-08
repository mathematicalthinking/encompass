/*global _:false */
Encompass.ImportWorkStep6Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step6',

  actions: {
    next() {
      this.get('onProceed')();
    },
    back() {
      this.get('onBack')(-1);
    }
  }
});