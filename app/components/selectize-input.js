/*global _:false */
import Component from '@ember/component';






export default Component.extend({
  showInput: true,
  classNames: ['selectize-comp'],
  didUpdateAttrs() {
    let newPropName = this.propName;
    let oldPropName = this.currentPropName;

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
    const newOptions = this.initialOptions;
    const currentOptions = this.options;
    if ((newOptions && currentOptions) && !_.isEqual(newOptions, currentOptions)) {
      selectizeControl.clearOptions();
      selectizeControl.addOption(newOptions);
      selectizeControl.refreshOptions(false);
    }
    this._super(...arguments);
  },

  didReceiveAttrs() {
    let options = this.initialOptions;
    let items = this.initialItems;

    if (!options) {
      if (this.model && this.valueField && this.labelField) {
        let peeked = this.store.peekAll(this.model);
        if (peeked) {
          options = peeked.map((record) => {
            let valueField = this.valueField;
            let labelField = this.labelField;
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

    if (_.isUndefined(this.currentPropName)) {
      this.set('currentPropName', this.propName);
    }

    let hash = this.configureOptionsHash();
    this.set('optionsHash', hash);

    // if (this.placeholder) {
    //   this.set('placeholder', this.placeholder);
    // }
    if (!this.propsToMap) {
      let propsToMap = [];
      propsToMap.addObject(this.labelField);
      propsToMap.addObject(this.valueField);
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
    let options = this.optionsHash;
    let id = this.inputId;
    this.$(`#${id}`).selectize(options);
    if (this.isDisabled) {
      this.$('select')[0].selectize.disable();
    }
    this._super(...arguments);
  },

  configureOptionsHash() {
    let hash = {
      valueField: this.valueField || 'id',
      labelField: this.labelField || 'id',
      searchField: this.searchField || 'id',
      options: this.options || [],
      maxItems: this.maxItems || null,
      maxOptions: this.maxOptions || 1000,
      items: this.items || [],
      create: this.create || false,
      persist: this.persist || false,
      createFilter: this.createFilter || null,
      preload: this.preload || false,
    };

    let that = this;
    let propToUpdate = this.propToUpdate;

    if (this.onItemAdd) {
      hash.onItemAdd = function (value, $item) {
        that.get('onItemAdd')(value, $item, propToUpdate, that.get('model'));
      };
    }

    if (this.onItemRemove) {
      hash.onItemRemove = function (value) {
        that.get('onItemRemove')(value, null, propToUpdate);
      };
    }

    if (this.onBlur) {
      hash.onBlur = this.onBlur;
    }

    if (this.isAsync) {
      hash.load = this.addItemsSelectize.bind(this);
    }

    return hash;

  },

  addItemsSelectize: function (query, callback) {
    if (this.doFetch === false) {
      return callback();
    }
    if (!query.length) {
      if (!this.preload) {
        return callback();
      }
      // to preload results
      query = ' ';
    }

    let key = this.queryParamsKey;
    /*
      for api that is expecting searchBy to be in shape:
      searchBy: {
        query: string,
        criterion: string
      }
    */
    let searchCriterion = this.searchCriterion;
    let queryParams = {};
    let topLevelQueryParams = this.topLevelQueryParams;
    let secondaryFilters = this.secondaryFilters;
    let customQueryParams = this.customQueryParams;

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

    let model = this.model;

    this.store.query(model, queryParams)
      .then((results) => {
        // results is Ember AdapterPopulatedRecordArray
        let meta = results.get('meta');
        this.set('metaData', meta);

        let resultsArray = results.toArray();
        let selectedItemsHash = this.selectedItemsHash;
        let valueField = this.valueField;
        // filter out already selected items
        if (_.isObject(selectedItemsHash) && _.isString(valueField)) {
          resultsArray = resultsArray.reject((record) => {
            return selectedItemsHash[record.get(valueField)];
          });
        }

        // if we want the ember objects
        // was having issues with this though
        if (this.useEmberObjectsAsync) {
          return callback(resultsArray);
        }

        let mapped = _.map(resultsArray, (item) => {
          let obj = {};

          let propsToMap = this.propsToMap;
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