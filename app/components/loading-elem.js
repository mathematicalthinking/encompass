Encompass.LoadingElemComponent = Ember.Component.extend({
  content: null,
  selectedValue: null,
  optionLabelPath: '',

  didInitAttrs: function (attrs) {
    this._super.apply(null, arguments);
    var content = this.get('content');

    if (!content) {
      this.set('content', []);
    }
  },

  actions: {
    selectChange: function () {
      var changeAction = this.get('action');
      var selectedEl = this.$('select')[0];
      var selectedIndex = selectedEl.selectedIndex;
      var content = this.get('content');
      var selectedValue = content[selectedIndex];

      this.set('selectedValue', selectedValue);
      changeAction(selectedValue);
    }
  }
});
