Encompass.FilterControlComponent = Ember.Component.extend({
  elementId: 'filter-control',
  hideMenu: true,
  selectedCategories: [],

  actions:{
    toggleShowMenu: function() {
      let hideMenu = this.get('hideMenu');
      this.set('hideMenu', !hideMenu);
    },
    addCategory: function(cat) {
      this.get('selectedCategories').addObject(cat);
      this.sendAction('addCategory', cat.id);
    },
    removeCategory: function(cat) {
      this.get('selectedCategories').removeObject(cat);
      this.get('removeCategory')(cat.id);
    }
  }
});