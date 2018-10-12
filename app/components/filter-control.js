Encompass.FilterControlComponent = Ember.Component.extend({
  elementId: 'filter-control',
  hideMenu: true,

  actions:{
    toggleShowMenu: function() {
      let hideMenu = this.get('hideMenu');
      this.set('hideMenu', !hideMenu);
    },
    updateFilter: function(opt) {
      console.log('opt', opt);
    }
  }
});