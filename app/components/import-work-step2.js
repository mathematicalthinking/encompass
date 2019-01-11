/*global _:false */
Encompass.ImportWorkStep2Component = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'import-work-step2',
  utils: Ember.inject.service('utility-methods'),
  selectingClass: Ember.computed.equal('selectedValue', true),

  useClass: {
    groupName: 'useClass',
    required: true,
    inputs: [{
        value: true,
        label: 'Yes',
      },
      {
        value: false,
        label: 'No',
      },
    ]
  },


  willDestroyElement: function () {
    this.set('selectedValue', this.get('selectedValue'));
  },

  initialSectionItem: function () {
      const selectedSection = this.get('selectedSection');
      if (this.get('utils').isNonEmptyObject(selectedSection)) {
        return [selectedSection.id];
      }
      return [];
  }.property('selectedSection'),

  initialSectionOptions: function () {
    const selectedSection = this.get('selectedSection');

    if (this.get('utils').isNonEmptyObject(selectedSection)) {
      return [{
        id: selectedSection.id,
        name: selectedSection.get('name')
      }];
    }
    return [];
  }.property('selectedSection'),

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
      if (this.get('missingSection')) {
        this.set('missingSection', null);
      }
    },
    next() {
      const selectedValue = this.get('selectedValue');
      if (!selectedValue) {
        this.set('selectedSection', null);
      }
      const section = this.get('selectedSection');
      if (this.get('utils').isNonEmptyObject(section) || !selectedValue) {
        this.get('onProceed')();
        return;
      }
      this.set('missingSection', true);

    },
    back() {
      this.get('onBack')(-1);
    }
  }
});