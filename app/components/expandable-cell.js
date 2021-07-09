Encompass.ExpandableCellComponent = Ember.Component.extend({
  expanded: Ember.computed.or('showAll', 'showThis'),
  showThis: false,
  tagName: '',
  actions:{
    toggleExpand(){
      this.toggleProperty('showThis');
    }
  }
});