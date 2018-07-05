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
      console.log('changeAction', changeAction);
      var selectedEl = this.$('select')[0];
      var selectedIndex = selectedEl.selectedIndex - 1;
      // the content that is being passed in is an ember object with a content property
      // that is an array of objects -- not sure if this is the best fix
      var content = this.get('content');
      var selectedValue = content.objectAt(selectedIndex);
      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});
