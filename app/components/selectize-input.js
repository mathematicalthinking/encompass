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

  @tracked selectizeInstance;

  // Fetch initial options if they are not provided
  async fetchInitialOptions() {
    let peeked = await this.store.peekAll(this.args.model);
    if (peeked) {
      this.options = peeked.map((record) => ({
        [this.args.valueField]: record.get(this.args.valueField),
        [this.args.labelField]: record.get(this.args.labelField),
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
    if (!query.length && !this.args.preload) {
      return callback();
    }

    let queryParams = {
      [this.args.queryParamsKey]: query,
    };

    this.store
      .query(this.args.model, queryParams)
      .then((results) => {
        let mappedResults = results.map((record) => {
          let obj = {};
          obj[this.args.valueField] = record.get(this.args.valueField);
          obj[this.args.labelField] = record.get(this.args.labelField);
          return obj;
        });

        callback(mappedResults);
      })
      .catch((error) => {
        console.error('Error fetching items:', error);
        callback();
      });
  }
}
