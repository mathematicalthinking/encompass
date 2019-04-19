/*global _:false */
Encompass.SearchBarComponent = Ember.Component.extend({
  classNames: ["search-bar-comp"],
  searchQuery: Ember.computed.alias("parentView.searchQuery"),
  searchInputValue: Ember.computed.alias("parentView.searchInputValue"),
  defaultConstraints: {
    query: {
      length: {
        minimum: 0,
        maximum: 500
      }
    }
  },

  init() {
    this._super(...arguments);

    let doDebounce = this.get('doDebounce') || true;
    let debounceTime = this.get('debounceTime') || 300;
    if (doDebounce) {
      this.set('debouncedSearch', _.debounce(this.onChangeSearch, debounceTime));
    }
  },

  showClear: function() {
    let hasSearchQuery = this.get('searchQuery');
    let hasSearchInputValue = this.get('searchInputValue');

    if (hasSearchQuery || hasSearchInputValue) {
      return true;
    } else {
      return false;
    }
  }.property('searchQuery', 'searchInputValue'),

  placeholder: function() {
    let base = this.get("basePlaceholder");
    if (!this.get("showFilter")) {
      return base;
    }
    let criterion = this.get("selectedCriterion");
    let combined = `${base} by ${criterion}`;
    return combined;
  }.property("basePlaceholder", "selectedCriterion", "showFilter"),

  inputStringValue: function() {
    let val = this.get("inputValue");
    if (!val) {
      return "";
    }
    // handle escaping?
    let trimmed = val.trim();
    let lowercase = trimmed.toLowerCase();
    if (this.get("queryErrors")) {
      this.set("queryErrors", null);
    }
    return lowercase;
  }.property("inputValue"),

  inputConstraints: function() {
    let constraints = this.get("constraints");
    if (constraints) {
      return constraints;
    }
    return this.get("defaultConstraints");
  }.property("constraints"),

  initiateSearch: function(val) {
    let criterion = this.get("selectedCriterion");
    this.get("onSearch")(val, criterion);
  },

  onChangeSearch: function() {
    this.send('validate');
  },

  actions: {
    clearResults: function() {
      // let textVal = this.get("inputValue");
      // let isString = _.isString(textVal);
      // if (!isString) {
      //   return;
      // }
      // let trimmed = textVal.trim();
      // if (trimmed.length === 0) {
        // just empty spaces, clear out search bar but dont bubble up and fetch
        this.set("inputValue", null);
        // return;
      // }
      this.get("clearSearchResults")();
    },

    validate: function() {
      let val = this.get("inputStringValue");
      let values = { query: val };
      let constraints = this.get("inputConstraints");

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
      if (this.get("queryErrors")) {
        this.set("queryErrors", null);
      }
    },
    searchAction: function() {
      this.send("validate");
    },
    onInputChange() {
      if (this.get('doSearchOnInputChange')) {
        if (this.get('debouncedSearch')) {
          return this.debouncedSearch();
        }
        this.send('validate');
      }
    }
  }
});