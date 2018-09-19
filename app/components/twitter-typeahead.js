Encompass.TwitterTypeaheadComponent = Ember.Component.extend({
  classNames: ['twitter-typeahead'],

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs(){
    this._super(...arguments);
    let templates = {};
    let notFound = this.get('showNotFound');
    let header = this.get('header');
    let footer = this.get('footer');
    let pending = this.get('pending');

    if (notFound) {
      templates.notFound = notFound;
    }

    if(header) {
      templates.header = header;
    }

    if (footer) {
      templates.footer = footer;
    }

    if (pending) {
      templates.pending = pending;
    }

    this.set('templates', templates);

  },

  didInsertElement() {
    this._super(...arguments);

    let dataList = this.get('dataList');
    let name = this.get('listName');
    let sourceFunction = this.get('sourceFunction');
    let path = this.get('optionLabelPath');
    let minLength = this.get('minLength');
    let limit = this.get('limit');
    let display = this.get('display');
    let selectedValue = this.get('selectedValue');
    let templates = this.get('templates');


    if (minLength === undefined || minLength === null || typeof minLength !== 'number') {
      minLength = 1;
    }

    if (minLength === undefined || minLength === null || typeof limit !== 'number') {
      limit = 5;
    }

    if (!path || typeof path !== 'string') {
      path = 'id';
    }

    if (!sourceFunction || typeof sourceFunction !== 'function') {
      sourceFunction = this.substringMatcher.bind(this);
    } else {
      sourceFunction = sourceFunction.bind(this);
    }

    if (!display) {
      display = function(suggestion) {
        return suggestion.get(path);
      };
    }

    this.$('.typeahead').typeahead({
      hint: false,
      highlight: true,
      minLength: minLength,
      limit: limit
    },
    {
      name: name,
      source: sourceFunction(dataList),
      display: display,
      templates: templates
    });

    let startingValue;

    if (selectedValue === undefined || selectedValue === null) {
      startingValue = '';
    } else if (typeof selectedValue === 'string') {
      startingValue = selectedValue;
    } else if (typeof selectedValue === 'object') {
      let val = selectedValue.get(path);
      if (val) {
        startingValue = val;
      } else {
        startingValue = '';
      }
    }

    this.$('.typeahead').typeahead('val', startingValue);

    const that = this;

    this.$('.typeahead').on('typeahead:select', function(ev, suggestion) {

      that.set('selectedValue', suggestion);
      if (that.get('onSelect')) {
        that.sendAction('onSelect', suggestion);
      }
      if (that.get('allowMultiple')) {
        that.$('.typeahead').typeahead('val', '');
      }
    });

    this.$('.typeahead').on('typeahead:change', function(ev, val) {
      let selectedValue = that.get('selectedValue');
      let inputValue = that.$('.typeahead').typeahead('val');

      if (selectedValue && typeof selectedValue === 'object') {
        // check if text value in typeahead component is same as the object's path value
        let str = selectedValue.get(path);
        if (inputValue === str) {
          return;
        }
      } else if (typeof selectedValue === 'string') {
        if (selectedValue === inputValue) {
          return;
        }
      }

      that.set('selectedValue', inputValue);
      if (that.get('onSelect')) {
        that.sendAction('onSelect', inputValue);

      }
      if (that.get('allowMultiple')) {
        that.$('.typeahead').typeahead('val', '');
      }
    });
  },

  substringMatcher: function(data) {
    // data should be array of ember objects

    let path = this.get('optionLabelPath');
    if (!path) {
      path = 'id';
    }

    if (!data) {
      data = [];
    }

    let suggestions;


    suggestions= data;



    const that = this;

    return function findMatches(q, cb) {
      var matches, substrRegex, filtered, pool;


      if (that.get('allowMultiple')) {
        // filter out already selected items

        let selectedItems = that.get('selectedItems');
        if (!selectedItems) {
          selectedItems = [];
        }

        filtered = suggestions.filter((item) => {
          let alreadySelected = selectedItems.includes(item);
          return !alreadySelected;
        });
      }

      if (filtered) {
        pool = filtered;
      } else {
        pool = suggestions;
      }
      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');
      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      matches = pool.filter((obj) => {
        let str = obj.get(path);
        return substrRegex.test(str);
      });

      cb(matches);
    };
  }

});