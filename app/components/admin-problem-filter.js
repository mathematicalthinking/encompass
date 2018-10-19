Encompass.AdminProblemFilterComponent = Ember.Component.extend({
  elementId: 'admin-problem-filter',
  mainFilter: Ember.computed.alias('secondaryFilter.selectedValue'),
  showOrgFilter: Ember.computed.equal('mainFilter', 'org'),
  showPowsFilter: Ember.computed.equal('mainFilter', 'pows'),

  showUserFilter: function() {
    let val = this.get('mainFilter');
    return val === 'author' || val === 'creator';
  }.property('mainFilter'),

  selectedValues: function() {
    let mainFilter = this.get('mainFilter');
    let secondaryFilter = this.get('secondaryFilter');
    return secondaryFilter.inputs[mainFilter].selectedValues;
  }.property('mainFilter'),

  actions: {
    setMainFilter(val, $item) {
      if (!val) {
        return;
      }
      this.set('mainFilter', val);
    },
    // updateOrgFilter(val, $item) {
    //   if (!val) {
    //     return;
    //   }
    //   let isRemoval = _.isNull($item);
    //   let orgFilter = this.get('orgFilter');
    //   if (isRemoval) {
    //     orgFilter.removeObject(val);
    //     if (this.get('onUpdate')) {
    //       this.get('onUpdate')();
    //     }
    //     return;
    //   }
    //   orgFilter.addObject(val);
    //   if (this.get('onUpdate')) {
    //     this.get('onUpdate')();
    //   }
    // }

    // $item is null if removal
    // propToUpdate should be sring prop
    updateMultiSelect(val, $item, propToUpdate) {
      if (!val || !propToUpdate) {
        return;
      }
      let isRemoval = _.isNull($item);
      let prop = this.get(propToUpdate);
      let isPropArray = _.isArray(prop);

      if (isRemoval) {
        if (!isPropArray) {
          this.set(prop, null);
        } else {
        prop.removeObject(val);
        }

        if (this.get('onUpdate')) {
          this.get('onUpdate')();
        }
        return;
      }
      if (!isPropArray) {
        this.set(prop, val);
      } else {
        prop.addObject(val);
      }

      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    }
  }
});