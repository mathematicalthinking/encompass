Encompass.TypeAheadComponent = Ember.Component.extend({
  content: null,
  textValue: null,
  selectedValue: null,
  isInputFocused: false,

  contentList: Ember.computed('selectContent', 'textValue', function() {
    console.log('computing contentList');
    let content = this.get('content');
    let textValue = this.get('textValue');
    if (!content) {
      return;
    }
    if (!textValue) {
      return content;
    }
    return content.filter((el) => {
      let firstChar = textValue[0];
      console.log('el', el);
      let val = el.get('name');
      //console.log('content', content);
      return val[0] === firstChar;
    });
  }),

  showContent: Ember.computed('textValue', 'selectedValue', 'isInputFocused', function() {
    let text = this.get('textValue');
    let value = this.get('selectedValue');
    let isInputFocused = this.get('isInputFocused');


    return text && isInputFocused && !value;


  }),

  didInsertElement: function() {
    this.get('contentList');
  },


  actions: {
    onChange: function(e) {
      console.log('e: ', e);
      let value = this.get('selectedValue');
      if (value) {
        this.set('selectedValue', null);
      }
  },

  onSelect: function(item) {
    let path = this.optionLabelPath;
    console.log('in onSelect', item);
    this.set('textValue', item.get(path));
    this.set('selectedValue', item);
  },
  onFocusChange: function(isFocused) {
    console.log('isFoc', isFocused);
    this.set('isInputFocused', isFocused);
},
  testChange: function(e) {
    console.log('e testChange', e);
  }
  }
});