Encompass.CategoriesMenuComponent = Ember.Component.extend({
  elementId: 'categories',

  init: function() {
    this._super(...arguments);
    console.log('categories menu init running');
    let categories = this.get('categories.meta');
    console.log('categories are', categories);
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


