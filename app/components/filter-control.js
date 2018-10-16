Encompass.FilterControlComponent = Ember.Component.extend({
  elementId: 'filter-control',
  hideMenu: true,
  selectedCategories: [],

  actions:{
    addCategory: function(cat) {
      this.get('selectedCategories').addObject(cat);
      this.sendAction('addCategory', cat.id);
    },
    removeCategory: function(cat) {
      this.get('selectedCategories').removeObject(cat);
      this.get('removeCategory')(cat.id);
    },
    updateFilter(e) {
      let {id, checked} = e.target;
      this.get('updateFilter')(id, checked);
    },
    updateSortCriterion(criterion) {
      this.get('updateSortCriterion')(criterion);
    }
  }
});