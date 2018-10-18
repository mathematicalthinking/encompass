Encompass.SelectizeInputComponent = Ember.Component.extend({

  didReceiveAttrs() {
    let hash = this.configureOptionsHash();
    this.set('optionsHash', hash);

    if (!this.placeholder) {
      this.set('placeholder', 'Start typing...');
    }
    if (!this.propsToMap) {
      let propsToMap = [];
      propsToMap.addObject(this.get('labelField'));
      propsToMap.addObject(this.get('valueField'));
      this.set('propsToMap', propsToMap);
    }

    this._super(...arguments);
  },

  // attrs passed in
  //
  // inputId
  // valueField
  // labelField
  // searchField
  // initialOptions
  // onItemAdd
  // onItemRemove
  // loadAsync
  // maxItems
  // maxOptions
  // placeholder
  // initialItems
  //propsToMap
  // useEmberObjectsAsync

  didInsertElement() {
    let options = this.get('optionsHash');
    let selector = `#${this.inputId}`;
    this.$(selector).selectize(options);
    this._super(...arguments);
  },

  configureOptionsHash() {

    let hash = {
      valueField: this.valueField || 'id',
      labelField:  this.labelField || 'id',
      searchField: this.searchField || 'id',
      options: this.initalOptions || [],
      maxItems: this.maxItems || null,
      maxOptions: this.maxOptions || 1000,
    };

    let that = this;

    if (this.onItemAdd) {
      hash.onItemAdd = function(value, $item) {
        that.get('onItemAdd')(value, $item);
      };
    }

    if (this.onItemRemove) {
      hash.onItemRemove = function(value) {
        that.get('onItemRemove')(value);
      };
    }

    if (this.isAsync) {
      hash.load = this.get('addItemsSelectize').bind(this);
    }
    return hash;

  },

  addItemsSelectize: function(query, callback) {
    if (!query.length) {
      return callback();
    }
    console.log('query', query);
    let queryParams = {};
    let key = this.get('queryParamsKey');
    queryParams[key] = query;

    let model = this.get('model');

    this.store.query(model, queryParams)
      .then((results) => {
        // results is Ember AdapterPopulatedRecordArray
        let resultsArray = results.toArray();

        // if we want the ember objects
        // was having issues with this though
        if (this.get('useEmberObjectsAsync')) {
          return callback(resultsArray);
        }

        let mapped = _.map(resultsArray, (item) => {
          let obj = {};

          let propsToMap = this.get('propsToMap');

          _.each(propsToMap, (prop) => {
            obj[prop] = item.get(prop);
          });

          return obj;
        });

        return callback(mapped);
      }).catch((err) => {
        this.set('dataFetchError', err);
      });
  }
});