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
      sourceFunction = this.substringMatcher;
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
      that.$('.typeahead').typeahead('val', '');
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
      var matches, substrRegex;

      let selectedItems = that.get('creators');
      if (!selectedItems) {
        selectedItems = [];
      }
      selectedItems = selectedItems.mapBy('username');

    let filtered = suggestions.filter((item) => {
      let alreadySelected = selectedItems.includes(item);
      return !alreadySelected;
    });

      // an array that will be populated with substring matches
      matches = [];

      // regex used to determine if a string contains the substring `q`
      substrRegex = new RegExp(q, 'i');

      // iterate through the pool of strings and for any string that
      // contains the substring `q`, add it to the `matches` array
      $.each(filtered, function(i, str) {
        if (substrRegex.test(str)) {
          matches.push(str);
        }
      });

      cb(matches);
    };
  }

});