Encompass.ExpandableCellComponent = Ember.Component.extend({
  expanded: false,
  tagName: '',
  actions:{
    toggleExpand(){
      this.toggleProperty('expanded');
    }
  }
});