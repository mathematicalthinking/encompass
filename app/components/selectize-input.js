Encompass.SelectizeInputComponent = Ember.Component.extend({
  showInput: true,
  classNames: ['selectize-comp'],
  didUpdateAttrs() {
    let newPropName = this.propName;
    let oldPropName = this.get('currentPropName');

    if (_.isUndefined(oldPropName)) {
      this.set('currentPropName', newPropName);
    } else {
      if (!_.isEqual(newPropName, oldPropName)) {
        // new id, need to clear inputs
        this.$('select')[0].selectize.clear(true);
        this.set('currentPropName', newPropName);
      }
    }
    this._super(...arguments);
  },

  didReceiveAttrs() {
    let options = this.get('initialOptions');
    let items = this.get('initialItems');

    this.set('options', options);
    this.set('items', items);

    if (_.isUndefined(this.get('currentPropName'))) {
      this.set('currentPropName', this.propName);
    }

    let hash = this.configureOptionsHash();
    this.set('optionsHash', hash);

    // if (this.placeholder) {
    //   this.set('placeholder', this.placeholder);
    // }
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
    let id = this.get('inputId');
    this.$(`#${id}`).selectize(options);
    this._super(...arguments);
  },

  configureOptionsHash() {
    let hash = {
      valueField: this.valueField || 'id',
      labelField:  this.labelField || 'id',
      searchField: this.searchField || 'id',
      options: this.get('options') || [],
      maxItems: this.maxItems || null,
      maxOptions: this.maxOptions || 1000,
      items: this.get('items') || [],
      create: this.create || false,
      persist: this.persist || false,
      createFilter: this.createFilter || null
    };

    let that = this;
    let propToUpdate = this.get('propToUpdate');

    if (this.onItemAdd) {
      hash.onItemAdd = function(value, $item) {
        that.get('onItemAdd')(value, $item, propToUpdate);
      };
    }

    if (this.onItemRemove) {
      hash.onItemRemove = function(value) {
        that.get('onItemRemove')(value, null, propToUpdate);
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
    let key = this.get('queryParamsKey');
    let queryParams = {};
    let topLevelQueryParams = this.get('topLevelQueryParams');

    if (topLevelQueryParams) {
      queryParams[topLevelQueryParams] = {
        [key]: query
      };
    } else {
      queryParams = {
        [key]: query
      };
    }

    let model = this.get('model');

    this.store.query(model, queryParams)
      .then((results) => {
        // results is Ember AdapterPopulatedRecordArray
        let meta = results.get('meta');
        this.set('metaData', meta);

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