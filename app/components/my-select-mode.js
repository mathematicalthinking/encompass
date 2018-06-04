Encompass.MySelectModeComponent = Ember.Component.extend({
  content: null,
  selectedValue: null,
  optionLabelPath: '',

  didInitAttrs: function(attrs) {
    this._super.apply(null, arguments);
    var content = this.get('content');

    if (!content) {
      this.set('content', []);
    }
  },

  actions: {
    selectChange: function() {
      var changeAction = this.get('action');
      console.log('changeAction: ', changeAction);
      var selectedEl = this.$('select')[0];
      var selectedIndex = selectedEl.selectedIndex;
      console.log('selectedIndex', selectedIndex);
      var content = this.get('content');
      console.log('content', content);
      var selectedValue = content[selectedIndex];
      console.log('selectedValue: ', selectedValue);

      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});
