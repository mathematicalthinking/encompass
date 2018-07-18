Encompass.MySelectComponent = Ember.Component.extend({
  content: null,
  selectedValue: null,
  optionLabelPath: '',

  // didInitAttrs is deprecated according to Ember docs
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
      var selectedEl = this.$('select')[0];
      var selectedIndex = selectedEl.selectedIndex - 1;
      var content = this.get('content');
      var selectedValue = content.objectAt(selectedIndex);
      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});
