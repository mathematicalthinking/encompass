import Component from '@glimmer/component';

export default class CategoriesMenuComponent extends Component {
  categories = [];

  constructor() {
    super(...arguments);
    this.categories = this.normalizeCategories(this.args.categories);
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
}
