import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CategoryFilterComponent extends Component {
  @service store;
  @service inputState;
  @tracked showCategoryList = false;
  @tracked selectedCategories = [];
  categoryTree = [];

  /**
   * <Problems::CategoryFilter
        @filterName={{@categoryFilterName}}
        @onUpdate={{@onUpdate}}
/>

    The category filter is assumed to have a single main option, which is selected by default.
    The list of selected categories is stored in the listState of that main option.
    The single main option has a single suboption, which is whether to include
    subcategories in the filter.
 */

  constructor() {
    super(...arguments);
    this.loadCategoryTree();
  }

  async loadCategoryTree() {
    let queryCats = await this.store.query('category', {});
    let categories = queryCats.meta;
    this.categoryTree = categories.categories;
  }

  get hasSelectedCategories() {
    return this.selectedCategories.length > 0;
  }

  get includeSubCatsOption() {
    return this.inputState.getSubOptions(this.args.filterName)[0].value;
  }

  get includeSubCats() {
    return this.inputState
      .getSubSelections(this.args.filterName)
      .includes(this.includeSubCatsOption);
  }

  @action
  toggleIncludeSubCats() {
    this.inputState.setSubSelection(
      this.args.filterName,
      this.includeSubCatsOption,
      !this.includeSubCats
    );
    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  handleAddCategory(category) {
    if (category && !this.selectedCategories.includes(category)) {
      this.selectedCategories = [...this.selectedCategories, category];
      this.inputState.setListState(
        this.args.filterName,
        this.selectedCategories
      );
      if (this.args.onUpdate) {
        this.args.onUpdate();
      }
    }
  }
  //   handleAddCategory(categoryId) {
  //     let category = this.store.peekRecord('category', categoryId);
  //     if (category && !this.selectedCategories.includes(category)) {
  //       this.selectedCategories = [...this.selectedCategories, category];
  //       this.inputState.setListState(
  //         this.args.filterName,
  //         this.selectedCategories
  //       );
  //       if (this.args.onUpdate) {
  //         this.args.onUpdate();
  //       }
  //     }
  //   }

  @action
  handleRemoveCategory(category) {
    this.selectedCategories = this.selectedCategories.filter(
      (selectedCategory) => selectedCategory.id !== category.id
    );
    this.inputState.setListState(this.args.filterName, this.selectedCategories);
    if (this.args.onUpdate) {
      this.args.onUpdate();
    }
  }

  @action
  handleOpenCategoryList() {
    this.showCategoryList = true;
  }

  @action
  handleCloseCategoryList() {
    this.showCategoryList = false;
  }
}
