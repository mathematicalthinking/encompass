Encompass.SearchBarComponent = Ember.Component.extend({
  classNames: ['search-bar-comp'],
  defaultConstraints: {
    query: {
      length: {
        minimum: 1,
        maximum: 500
      }
    }
  },

  placeholder: function() {
    let base = this.get('basePlaceholder');
    if (!this.get('showFilter')) {
      return base;
    }
    let criterion = this.get('selectedCriterion');
    let combined = `${base} by ${criterion}`;
    return combined;
  }.property('basePlaceholder','selectedCriterion','showFilter'),

  inputStringValue: function() {
    let val = this.get('inputValue');
    if (!val) {
      return '';
    }
    // handle escaping?
    let trimmed = val.trim();
    let lowercase = trimmed.toLowerCase();
    if (this.get('queryErrors')) {
      this.set('queryErrors', null);
    }
    return lowercase;

  }.property('inputValue'),

  inputConstraints: function() {
    let constraints = this.get('constraints');
    if (constraints) {
      return constraints;
    }
    return this.get('defaultConstraints');
  }.property('constraints'),

  initiateSearch: function(val) {
    let criterion = this.get('selectedCriterion');
    this.get('onSearch')(val, criterion);
  },

  actions: {
    clearResults: function () {
      this.get('clearSearchResults')();
    },

    validate: function() {
      let val = this.get('inputStringValue');
      let values = { query: val };
      let constraints = this.get('inputConstraints');

      let errors = window.validate(values, constraints);
      if (errors) {
        for (let key of Object.keys(errors)) {
          let errorProp = `${key}Errors`;
          this.set(errorProp, errors[key]);
        }
        return;
      }
      // handle validation success
      this.initiateSearch(val);
    },
    clearErrors: function() {
      if (this.get('queryErrors')) {
        this.set('queryErrors', null);
      }
    },
    searchAction: function () {
      this.send('validate');
    },
  }
});