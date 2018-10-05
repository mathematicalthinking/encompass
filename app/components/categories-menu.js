Encompass.CategoriesMenuComponent = Ember.Component.extend({
  elementId: 'categories',

  didRecieveAttrs: function() {
    this._super(...arguments);
    let categories = this.get('categories.meta');
    this.set('categories', categories.categories);
  },

  actions: {
    addCategory: function (category) {
      let identifier = category.identifier;
      this.get('store').queryRecord('category', {identifier: identifier}).then((cat) => {
        this.sendAction('addCategories', cat);
      });
      // this.get('store').find('category', categoryId).then((cat) => {
      //   this.sendAction('addCategories', cat);
      // });
    },
  }

});

