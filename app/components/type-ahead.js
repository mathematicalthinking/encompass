Encompass.TypeAheadComponent = Ember.Component.extend({
  content: null,
  textValue: null,
  selectedValue: null,
  contentByLabelPath: null,

  didInsertElement: function() {
    this.get('getValue');
    let content = this.get('content');
    let path = this.get('optionLabelPath');
    let byPath = content.mapBy(path);
    this.set('contentByLabelPath', byPath);
    window.autocomplete(document.getElementById("organization"), byPath);
  },

  getValue: function() {
    let text = this.get('textValue');
    if (!text) {
      this.set('selectedValue', '');
      return '';
    }
    let content = this.get('content');
    let path = this.get('optionLabelPath');

    let matched = content.filter((el) => {
      let val = el.get(path);
      let lowerVal;
      if (val && typeof val === 'string') {
        lowerVal = val.toLowerCase();
      }
      return lowerVal === text.toLowerCase();
    });

    if (!Ember.isEmpty(matched)) {
      let val = matched.get('firstObject');
      this.set('selectedValue', val);
      return val;
    }
    this.set('selectedValue', text);
    return text;
  }.observes('textValue'),
});