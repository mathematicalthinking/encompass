Encompass.QuillContainerComponent = Ember.Component.extend({
  classNames: ['quill-container'],
  utils: Ember.inject.service('utility-methods'),

  isEmpty: true,
  isOverLengthLimit: false,

  defaultOptions : {
    debug: 'false',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['blockquote'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['link', 'image', 'formula']
      ]
    },
    theme: 'snow'
  },

  defaultMaxLength: 14680064, // 14MB

  didReceiveAttrs() {
    let attrSectionId = this.get('attrSectionId');
    if (!attrSectionId) {
      this.set('sectionId', 'editor');
    } else {
      this.set('sectionId', attrSectionId);
    }

    let limit = this.get('maxLength') || this.get('defaultMaxLength');
    this.set('lengthLimit', limit);

  },

  didInsertElement() {
    let elId = this.elementId;
    let selector = `#${elId} section`;

    let options;
    if (!this.get('options')) {
      options = this.get('defaultOptions');
    }
    options.bounds = selector;

    $(selector).ready(() => {
      let quill = new window.Quill(selector, options);
      this.set('quillInstance', quill);

      quill.on('text-change', (delta, oldDelta, source) => {
        this.handleQuillChange();
      });

      if (this.get('startingText')) {
        this.$('.ql-editor').html(this.get('startingText'));
      }

      this.handleQuillChange();

    });
    this._super(...arguments);
  },

  willDestroyElement() {
    let quill = this.get('quillInstance');
    if (quill) {
      quill.off('text-change');
    }
    this._super(...arguments);
  },

  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or a student
  // must have uploaded an img so there must be an img tag
  isQuillNonEmpty() {
    let pText = this.$('.ql-editor p').text();

    let trimmed = typeof pText === 'string' ? pText.trim() : '';
    if (trimmed.length > 0) {
      return true;
    }
    let content = this.$('.ql-editor').html();
    if (content.includes('<img')) {
      return true;
    }
    return false;
  },

  handleQuillChange() {
    let editor = this.$('.ql-editor');
    if (!editor) {
      return;
    }

    let htmlContents = editor.html();

    let replaced = htmlContents.replace(/["]/g, "'");
    let isEmpty = !this.isQuillNonEmpty();
    this.set('isEmpty', isEmpty);

    let isOverLengthLimit = replaced.length > this.get('lengthLimit');
    this.set('isOverLengthLimit', isOverLengthLimit);

    this.onTextChange(replaced, isEmpty, isOverLengthLimit );
  },

  onTextChange(html, isEmpty, isOverLengthLimit) {
    if (this.get('onEditorChange')) {
      this.get('onEditorChange')(html, isEmpty, isOverLengthLimit);
    }
  }

});