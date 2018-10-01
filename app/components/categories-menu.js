Encompass.CategoriesMenuComponent = Ember.Component.extend({
  elementId: 'categories',

  init: function () {
    this._super(...arguments);
    this.get('store').findAll('category').then((categories) => {
      let categoryList = categories;
      categoryList.forEach((category) => {
        let identifier = category.get('identifier');
        if (identifier.startsWith('CCSS.Math.Content.K')) {
          console.log('identifier', identifier);
        }
      });
    });
  },

});


