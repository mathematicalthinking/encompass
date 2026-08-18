import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class CategoriesMenuComponent extends Component {
  @service store;
  @tracked categories = [];

  constructor() {
    super(...arguments);
    this.loadCategoryTree().then((categories) => {
      this.categories = this.normalizeCategories(categories);
    });
  }

  async loadCategoryTree() {
    const queryCats = await this.store.query('category', {});
    const categories = queryCats.meta;
    return categories.categories;
  }

  normalizeCategories(categories = []) {
    return categories.map((category) => {
      return {
        ...category,
        url: null,
        children: this.normalizeDomains(category.domains),
      };
    });
  }

  normalizeDomains(domains = []) {
    return domains.map((domain) => {
      return {
        ...domain,
        children: this.normalizeTopics(domain.topics),
      };
    });
  }

  normalizeTopics(topics = []) {
    return topics.map((topic) => {
      return {
        ...topic,
        url: null,
        children: this.normalizeStandards(topic.standards),
      };
    });
  }

  normalizeStandards(standards = []) {
    return standards.map((standard) => {
      return {
        ...standard,
        url: null,
        children: standard.substandards || [],
      };
    });
  }

  @action
  async addCategory(category) {
    if (category) {
      const [categ] = await this.store.query('category', {
        identifier: category.identifier,
      });
      console.log('categ', categ);
      if (categ && this.args.addCategory) {
        this.args.addCategory(categ);
      }
    }
  }
}
