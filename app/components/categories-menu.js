import Component from '@ember/component';

export default Component.extend({
  elementId: 'categories',

  // didReceiveAttrs: function () {
  //   this._super(...arguments);
  //   let categories = this.categories.meta;
  //   this.set('categories', categories.categories);
  // },

  actions: {
    addCategory: function (category) {
      let identifier = category.identifier;
      this.store
        .queryRecord('category', { identifier: identifier })
        .then((cat) => {
          this.sendAction('addCategories', cat);
        });
    },
  },
});
