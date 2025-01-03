import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CategoriesMenu extends Component {
  @action
  addCategory(category) {
    const cat = this.store.peekRecord('category', {
      identifier: category.identifier,
    });
    this.args.addCategories(cat);
  }
}
