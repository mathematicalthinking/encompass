Encompass.MySelectComponent = Ember.Component.extend({
  content: null,
  selectedValue: null,
  optionLabelPath: '',
  classNames: ['mySelect'],

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
      var selectedIndex;

      if (this.prompt) {
        selectedIndex = selectedEl.selectedIndex - 1;
      } else {
        selectedIndex = selectedEl.selectedIndex;
      }

      var content = this.get('content');
      console.log('slectedindex', selectedIndex);
      console.log('length', content.length);
      var selectedValue = content.objectAt(selectedIndex);
      console.log('selectedValue', selectedValue);
      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});
