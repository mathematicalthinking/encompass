/*global _:false */
Encompass.ImportWorkStep3Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step3',
  utils: Ember.inject.service('utility-methods'),

  actions: {
    setSelectedSection(val, $item) {
      if (!val) {
        return;
      }

      const isRemoval = _.isNull($item);
      if (isRemoval) {
        this.set('selectedSection', null);
        return;
      }

      const section = this.get('store').peekRecord('section', val);
      if (this.get('utils').isNullOrUndefined(section)) {
        return;
      }

      this.set('selectedSection', section);
      if (this.get('missingFiles')) {
        this.set('missingFiles', null);
      }
    },
    next() {
      const section = this.get('selectedSection');
      // workspace is required to go to next step
      if (this.get('utils').isNonEmptyObject(section)) {
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