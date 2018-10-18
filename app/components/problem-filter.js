Encompass.ProblemFilterComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  elementId: 'problem-filter',
  primaryFilterValue: Ember.computed.alias('primaryFilter.value'),
  primaryFilterInputs: Ember.computed.alias('filter.primaryFilters.inputs'),
  secondaryFilter: Ember.computed.alias('primaryFilter.secondaryFilters'),
  showAdminFilters: Ember.computed.equal('primaryFilter.value', 'all'),
  showTypeahead: true,

  orgOptions: function() {
    let orgs = this.get('orgs');
    let toArray = orgs.toArray();
    let mapped = _.map(toArray, (org) => {
      return {
        id: org.id,
        name: org.get('name')
      };

    });
    return mapped;
  }.property('orgs.[]'),

  didReceiveAttrs() {
    let selectedAllFilter = this.get('selectedAllFiler');
    if (!selectedAllFilter) {
      let defaultValue = this.get('adminFilterSelect.defaultValue');
      if (_.isArray(defaultValue)) {
        defaultValue = defaultValue[0];
      }
      this.set('selectedAllFilter', defaultValue);
    }

    this._super(...arguments);
  },

  allSelectOptions: function() {
    let value = this.get('selectedAllFilter');
    let options = {};
    if (value === 'organization') {
      options.inputId ='filter-select-org';
      options.labelField = 'name';
      options.valueField='id';
      options.maxItems=3;
      options.initialOptions = this.get('orgOptions');
      options.isAsync=false;
      options.propToUpdate = 'orgFilter';
      return options;
    }

    if (value === 'creator' || value === 'author') {
      options.maxItems=3;
      options.isAsync=true;
      options.valueField='id';
      options.model='user';
      options.queryParamsKey = 'usernameSearch';
      options.inputId='filter-select-user';
      options.labelField = 'username';
      options.searchField = 'username';

      if (value === 'creator') {
        options.propToUpdate='creatorFilter';
      }
      options.propToUpdate = 'authorFilter';
    }

  }.property('selectedAllFilter', 'showTypeahead'),


  primaryFilterOptions: function() {
    let mapped = _.map(this.get('primaryFilterInputs'), (val, key) => {
      return val;
    });
    return _.sortBy(mapped, 'label');
  }.property('filter'),

  secondaryFilterOptions: function() {
    return _.map(this.get('primaryFilter.secondaryFilters.inputs'), (val, key) => {
      return val;
    });
  }.property('primaryFilter'),

  test() {
    this.set('showTypeahead', true);
  },

  actions: {
    updateTopLevel(val) {
      // need to set filter[val] : true
      // but also need to make sure the current selected item is now false
      let currentValue = this.get('primaryFilterValue');
      if (!Ember.isEqual(currentValue, val)) {
        let newPrimaryFilter = this.get('primaryFilterInputs')[val];
        this.set('primaryFilter', newPrimaryFilter);
        if (this.get('onUpdate')) {
          this.get('onUpdate')();
        }
      }
    },
    updateSecondLevel(e) {
      let { id } = e.target;
      let secondaryFilter = this.get('secondaryFilter');

      let targetInput = secondaryFilter.inputs[id];
      if (!targetInput) {
        // not a valid option
        return;
      }
      // valid option, toggle the inputs isApplied value
      targetInput.isApplied = !targetInput.isApplied;

      // filter for inputs who are currently applied
      let appliedInputs = _.filter(secondaryFilter.inputs, (input) => {
        return input.isApplied;
      });

      let appliedValues = _.map(appliedInputs, input => input.value);

      // update selectedValues on secondaryFilter

      secondaryFilter.selectedValues = appliedValues;
      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }
    },

    updateAllFilter(val, $item, prop) {
      console.log('updated all filter', val, $item);
      let isRemoval;
      if (!val) {
        return;
      }

      if (_.isNull($item)) {
        isRemoval = true;
      }

      let currentFilter = this.get(prop);
      if (!currentFilter) {
        this.set(currentFilter, []);
      }

      if (isRemoval) {
        currentFilter.removeObject(val);
      } else {
        currentFilter.addObject(val);
      }
      if (this.get('onUpdate')) {
        this.get('onUpdate')();
      }

    },
    setAllFilter(val, $item) {
      this.set('selectedAllFilter', val);
      console.log('val', val);
    },

  }
});