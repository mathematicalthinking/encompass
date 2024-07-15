import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CategoriesMenu extends Component {
  // didReceiveAttrs: function () {
  //   this._super(...arguments);
  //   let categories = this.get('categories.meta');
  //   this.set('categories', categories.categories);
  // }
  addCategoryAction(cat) {
    this.addCategories(cat);
  }
  @action
  addCategory(category) {
    let identifier = category.identifier;
    this.store
      .queryRecord('category', { identifier: identifier })
      .then((cat) => {
        this.addCategoryAction('addCategories', cat);
      });
  }
}
