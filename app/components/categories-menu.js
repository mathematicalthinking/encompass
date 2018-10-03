Encompass.CategoriesMenuComponent = Ember.Component.extend({
  elementId: 'categories',

  init: function() {
    this._super(...arguments);
    let categories = this.get('categories.meta');
    this.set('categories', categories.categories);
  },

});


