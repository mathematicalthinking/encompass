Encompass.CategoriesMenuComponent = Ember.Component.extend({
  elementId: 'categories',

  init: function() {
    this._super(...arguments);
    let categories = this.get('categories.meta');
    this.set('categories', categories.categories);

  },

  actions: {
    addCategory: function (category) {
      let categoryId = category.id;
      console.log('catId', categoryId);
      this.get('store').findRecord('category', categoryId).then((cat) => {
        console.log('category is', cat);
      });
    },
  }

});


