Encompass.CategoriesListMixin = Ember.Mixin.create({
  application: Ember.inject.controller(),
  selectedCategories: Ember.computed.alias('application.selectedCategories'),
});
