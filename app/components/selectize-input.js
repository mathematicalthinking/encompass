Encompass.SelectizeInputComponent = Ember.Component.extend({
  showInput: true,

  didReceiveAttrs() {
    console.log('did receive attrs sel-inpt');
    let currentInputId = this.get('currentInputId');
    let attrInputId = this.get('inputId');

    let didIdChange = currentInputId !== attrInputId;
    console.log('didId change', didIdChange);

    let currentPropToUpdate = this.get('currentPropToUpdate');
    let attrProp = this.get('propToUpdate');
    let didPropChange = currentPropToUpdate !== attrProp;
    console.log('did prop change', didPropChange);


    if (!currentInputId) {
      this.set('currentInputId', attrInputId);
    }  else if (didIdChange) {
    console.log('new id!');
    this.set('currentInputId', attrInputId);
    let current = this.$('select')[0].selectize;
    current.clear();
    current.clearOptions();
    current.destroy();

    let newId = `#${attrInputId}`;
    // newSelect = this.$(`select${newId}`);
      let that = this;
    this.$(newId).ready(function() {
      let newSelect = that.$('select')[0];
      console.log('newSelect', newSelect);
      let options = that.get('initialOptions');
    let items = that.get('initialItems');

    that.set('options', options);
    that.set('items', items);

    let hash = that.configureOptionsHash();
    that.set('optionsHash', hash);

    if (!that.placeholder) {
      that.set('placeholder', 'Start typing...');
    }

      let propsToMap = [];
      propsToMap.addObject(that.get('labelField'));
      propsToMap.addObject(that.get('valueField'));
      that.set('propsToMap', propsToMap);

        // reinit selectize
        let newOptions = that.get('optionsHash');
        that.$(`#${attrInputId}`).selectize(newOptions);
    });

    } else if (didPropChange) {
      let selectize = this.$(`#${currentInputId}`)[0].selectize;
      selectize.clear();
      selectize.clearOptions();
      return;
    }
    let options = this.get('initialOptions');
    let items = this.get('initialItems');

    this.set('options', options);
    this.set('items', items);

    let hash = this.configureOptionsHash();
    this.set('optionsHash', hash);

    if (!this.placeholder) {
      this.set('placeholder', 'Start typing...');
    }

      let propsToMap = [];
      propsToMap.addObject(this.get('labelField'));
      propsToMap.addObject(this.get('valueField'));
      this.set('propsToMap', propsToMap);

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
    console.log('did Insert Element sel-inpt');
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
      options: this.get('options') || [],
      maxItems: this.maxItems || null,
      maxOptions: this.maxOptions || 1000,
      items: this.get('items') || []
    };

    let that = this;

    if (this.onItemAdd) {
      let propToUpdate = this.get('propToUpdate');

      hash.onItemAdd = function(value, $item) {
        that.get('onItemAdd')(value, $item, propToUpdate);
      };
    }

    if (this.onItemRemove) {
      let propToUpdate = this.get('propToUpdate');
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
    let queryParams = {};
    let allowEmpty = this.get('allowEmptyQuery');
    if (!query.length) {
      if (!allowEmpty) {
        return callback();
      }
    }
    console.log('query', query);
    if (query.length > 0) {
      let key = this.get('queryParamsKey');
      queryParams[key] = query;
    }
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