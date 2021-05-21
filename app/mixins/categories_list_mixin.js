//app/components/problem-filter.js and app/components/problem-list-container.js
Encompass.CategoriesListMixin = Ember.Mixin.create({
  application: Ember.inject.controller(),
  selectedCategories: Ember.computed.alias('application.selectedCategories'),
});
