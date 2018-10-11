Encompass.QuillContainerComponent = Ember.Component.extend({
  classNames: ['quill-container'],
  defaultOptions : {
    debug: 'false',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline'],
        ['image'],
      ]
    },
    theme: 'snow'
  },

  didInsertElement: function() {
    let elId = this.elementId;
    let selector = `#${elId} section`;

    let options;
    if (!this.get('options')) {
      options = this.get('defaultOptions');
    }

    this.sendAction('setup',selector, options);
  }
});