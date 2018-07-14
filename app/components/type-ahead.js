Encompass.TypeAheadComponent = Ember.Component.extend({
  selectContent: null,
  textValue: null,
  selectedValue: null,

  actions: {
    onChange: function(val) {
      console.log('val: ', val);
    }
  }
});