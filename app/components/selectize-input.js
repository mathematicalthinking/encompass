/*global _:false */
Encompass.SelectizeInputComponent = Ember.Component.extend({
  showInput: true,
  classNames: ['selectize-comp'],
  didUpdateAttrs() {
    let newPropName = this.propName;
    let oldPropName = this.get('currentPropName');

    let selectizeControl = this.$('select')[0].selectize;
    if (!selectizeControl) {
      return;
    }

    if (_.isUndefined(oldPropName)) {
      this.set('currentPropName', newPropName);
    } else {
      if (!_.isEqual(newPropName, oldPropName)) {
        // new id, need to clear inputs
        selectizeControl.clear(true);
        this.set('currentPropName', newPropName);
      }
    }
    const newOptions = this.get('initialOptions');
    const currentOptions = this.get('options');
    if ((newOptions && currentOptions) && !_.isEqual(newOptions, currentOptions)) {
      selectizeControl.clearOptions();
      selectizeControl.addOption(newOptions);
      selectizeControl.refreshOptions(false);
    }
    this._super(...arguments);
  },

  didReceiveAttrs() {
    let options = this.get('initialOptions');
    let items = this.get('initialItems');

    if (!options) {
      if (this.get('model') && this.get('valueField') && this.get('labelField')) {
        let peeked = this.get('store').peekAll(this.get('model'));
        if (peeked) {
          options = peeked.map((record) => {
            let valueField = this.get('valueField');
            let labelField = this.get('labelField');
            return {
              [valueField]: record.get(valueField),
              [labelField]: record.get(labelField)

            };
          });
        }
      }
    }

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
    if (this.get('isDisabled')) {
      this.$('select')[0].selectize.disable();
    }
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
      createFilter: this.createFilter || null,
      preload: this.preload || false,
    };

    let that = this;
    let propToUpdate = this.get('propToUpdate');

    if (this.onItemAdd) {
      hash.onItemAdd = function(value, $item) {
        that.get('onItemAdd')(value, $item, propToUpdate, that.get('model'));
      };
    }

    if (this.onItemRemove) {
      hash.onItemRemove = function(value) {
        that.get('onItemRemove')(value, null, propToUpdate);
      };
    }

    if (this.onBlur) {
      hash.onBlur = this.onBlur;
    }

    if (this.isAsync) {
      hash.load = this.get('addItemsSelectize').bind(this);
    }

    return hash;

  },

  addItemsSelectize: function(query, callback) {
    if (this.get('doFetch') === false) {
      return callback();
    }
    if (!query.length) {
      if (this.get('preload') !== true) {
        return callback();
      }
      // to preload results
      query = ' ';
    }

    let key = this.get('queryParamsKey');
    /*
      for api that is expecting searchBy to be in shape:
      searchBy: {
        query: string,
        criterion: string
      }
    */
    let searchCriterion = this.get('searchCriterion');
    let queryParams = {};
    let topLevelQueryParams = this.get('topLevelQueryParams');
    let secondaryFilters = this.get('secondaryFilters');
    let customQueryParams = this.get('customQueryParams');

    if (customQueryParams) {
      // use custom params object passed in
      let base = {
        [key]: query
      };

      queryParams = Object.assign(base, customQueryParams);
    } else if (topLevelQueryParams) {
      queryParams[topLevelQueryParams] = {
        [key]: query
      };
      if (secondaryFilters) {
        _.each(secondaryFilters, (val, key) => {
          if (key === 'ids') {
            queryParams.ids = val;
          } else {
            queryParams[topLevelQueryParams][key] = val;
          }
        });
      }
      if (searchCriterion) {
        queryParams[topLevelQueryParams].criterion = searchCriterion;
      }
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
        let selectedItemsHash = this.get('selectedItemsHash');
        let valueField = this.get('valueField');
        // filter out already selected items
        if (_.isObject(selectedItemsHash) && _.isString(valueField)) {
          resultsArray = resultsArray.reject((record) => {
            return selectedItemsHash[record.get(valueField)];
          });
        }

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