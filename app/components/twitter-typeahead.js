Encompass.TwitterTypeaheadComponent = Ember.Component.extend({
  classNames: ['twitter-typeahead'],

  init() {
    this._super(...arguments);
  },

  didReceiveAttrs(){
    this._super(...arguments);
  },

  didInsertElement() {
    this._super(...arguments);


    let dataList = this.get('dataList');
    const name = this.get('listName');
    let sourceFunction = this.get('sourceFunction');

    if (!sourceFunction) {
      sourceFunction = this.substringMatcher.bind(this);
    } else {
      sourceFunction = sourceFunction.bind(this);
    }

    this.$('.typeahead').typeahead({
      hint: false,
      highlight: true,
      minLength: 1
    },
    {
      name: name,
      source: sourceFunction(dataList),
    });

    const that = this;

    this.$('.typeahead').on('typeahead:select', function(ev, suggestion) {
      console.log('Selection: ' + suggestion);

      that.set('selectedValue', suggestion);
      that.sendAction('onSelect', suggestion);
      if (that.get('allowMultiple')) {
        that.$('.typeahead').typeahead('val', '');
      }
    });

    this.$('.typeahead').on('typeahead:change', function(ev, val) {
      console.log('on change event: ', ev);
      console.log('Val on change: ' + val);

      let inputValue = that.$('.typeahead').typeahead('val');
      if (inputValue === that.get('selectedValue')) {
        return;
      }

      that.set('selectedValue', inputValue);
      that.sendAction('onSelect', inputValue);
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

    let suggestions = data.map((obj) => {
      return obj.get(path);
    });

    const that = this;

    return function findMatches(q, cb) {
      var matches, substrRegex, filtered, pool;


      if (that.get('allowMultiple')) {
        // filter out already selected items

        let selectedItems = that.get('selectedItems');
        if (!selectedItems) {
          selectedItems = [];
        }
        selectedItems = selectedItems.mapBy(path);

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
      $.each(pool, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  }

});