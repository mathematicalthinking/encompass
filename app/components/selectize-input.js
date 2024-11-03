import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import 'selectize';
import $ from 'jquery';

export default class SelectizeInputComponent extends Component {
  @service store;

  @tracked options = this.args.initialOptions || [];
  @tracked items = this.args.initialItems || [];
  @tracked dataFetchError;
  @tracked metaData;

  @tracked selectizeInstance;

  // Fetch initial options if they are not provided
  async fetchInitialOptions() {
    let peeked = await this.store.peekAll(this.args.model);
    if (peeked) {
      this.options = peeked.map((record) => ({
        [this.args.valueField]: record[this.args.valueField],
        [this.args.labelField]: record[this.args.labelField],
      }));
    }
  }

  @action
  async initializeSelectize(element) {
    // If no initialOptions are provided, fetch options asynchronously
    if (
      !this.args.initialOptions &&
      this.args.model &&
      this.args.valueField &&
      this.args.labelField
    ) {
      await this.fetchInitialOptions(); // Ensure fetching is complete before initializing
    }

    if (this.args.initialOptions) {
      this.options = this.args.initialOptions;
    }

    const optionsHash = this.configureOptionsHash();
    const selectizeInstance = $(element).selectize(optionsHash);
    this.selectizeInstance = selectizeInstance[0].selectize;

    if (this.args.isDisabled) {
      this.selectizeInstance.disable();
    }
  }

  @action
  async updateSelectizeOptions(element) {
    if (this.selectizeInstance) {
      this.selectizeInstance.destroy();
    }
    this.initializeSelectize(element);
  }

  configureOptionsHash() {
    let hash = {
      valueField: this.args.valueField || 'id',
      labelField: this.args.labelField || 'id',
      searchField: this.args.searchField || 'id',
      options: this.options || [],
      maxItems: this.args.maxItems || null,
      maxOptions: this.args.maxOptions || 1000,
      items: this.items || [],
      create: this.args.create || false,
      persist: this.args.persist || false,
      createFilter: this.args.createFilter || null,
      preload: this.args.preload || false,
    };

    const propToUpdate = this.args.propToUpdate;

    if (this.args.onItemAdd) {
      hash.onItemAdd = (value, $item) => {
        this.args.onItemAdd(value, $item, propToUpdate, this.args.model);
      };
    }

    if (this.args.onItemRemove) {
      hash.onItemRemove = (value) => {
        this.args.onItemRemove(value, null, propToUpdate);
      };
    }

    if (this.args.onBlur) {
      hash.onBlur = this.args.onBlur;
    }

    if (this.args.isAsync) {
      hash.load = this.addItemsSelectize.bind(this);
    }

    return hash;
  }

  // Method to handle loading async items
  addItemsSelectize(query, callback) {
    // Check if fetching is disabled or if query is empty without preload
    if (!query.length && !this.args.isAsync) {
      return callback();
    }

    // Handle preload scenario by using a space query
    if (!query.length) {
      if (!this.args.preload) {
        return callback();
      }
      query = ' ';
    }

    const key = this.args.queryParamsKey;
    /*
    for api that is expecting searchBy to be in shape:
    searchBy: {
      query: string,
      criterion: string
      }
      */

    let queryParams = {};
    const searchCriterion = this.args.searchCriterion;
    const topLevelQueryParams = this.args.topLevelQueryParams;
    const secondaryFilters = this.args.secondaryFilters;
    const customQueryParams = this.args.customQueryParams;

    // Build query parameters based on provided arguments
    if (customQueryParams) {
      queryParams = {
        ...{ [key]: query },
        ...customQueryParams,
      };
    } else if (topLevelQueryParams) {
      queryParams[topLevelQueryParams] = { [key]: query };

      if (secondaryFilters) {
        Object.entries(secondaryFilters).forEach(([filterKey, val]) => {
          if (filterKey === 'ids') {
            queryParams.ids = val;
          } else {
            queryParams[topLevelQueryParams][filterKey] = val;
          }
        });
      }

      if (searchCriterion) {
        queryParams[topLevelQueryParams].criterion = searchCriterion;
      }
    } else {
      queryParams = { [key]: query };
    }

    const model = this.args.model;
    // Fetch data from the store using the model specified in the arguments
    this.store
      .query(model, queryParams)
      .then((results) => {
        // results is Ember AdapterPopulatedRecordArray
        this.metaData = results.meta;
        let resultsArray = results.toArray();
        const selectedItemsHash = this.args.selectedItemsHash;
        const valueField = this.args.valueField;

        // Filter out already selected items if necessary
        if (selectedItemsHash && valueField) {
          resultsArray = resultsArray.filter(
            (record) => !selectedItemsHash[record.valueField]
          );
        }

        // If async useEmberObjectsAsync is set, return Ember objects directly
        if (this.args.isAsync) {
          return callback(resultsArray);
        }

        // Map results to the required format
        const mappedResults = resultsArray.map((item) => {
          return {
            [this.args.valueField]: item[this.args.valueField],
            [this.args.labelField]: item[this.args.labelField],
          };
        });

        callback(mappedResults);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        this.dataFetchError = error;
      });
  }
}
