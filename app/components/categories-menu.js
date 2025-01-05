import Component from '@glimmer/component';

export default class CategoriesMenuComponent extends Component {
  categories = [];
  constructor() {
    super(...arguments);
    this.categories = this.normalizeCategories(this.args.categories || []);
  }

  normalizeCategories(categories) {
    for (let category of categories) {
      category.children = category.domains || [];
      category.url = null;
      for (let domain of category.children) {
        domain.children = domain.topics || [];
        for (let topic of domain.children) {
          topic.children = topic.standards || [];
          topic.url = null;
          for (let standard of topic.children) {
            standard.url = null;
            standard.children = standard.substandards || [];
          }
        }
      }
    }
  }
}
