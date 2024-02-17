import { inject as service } from '@ember/service';
import Component from '@ember/component';
import $ from 'jquery';

/**
 * A QuillContainer is a component wrapper for a Quill text editor. See https://quilljs.com/docs/quickstart/
 * Arguments:
 *  @param {string} startingText - initial contents of the Quill editor
 *  @param {string} [attrSectionId = 'editor'] -the id of the <section> tag that contains the Quill editor
 *  @param {function} onEditorChange - an action that gets called when the user changes the text in the editor.
 *                   This action should take three arguments: the html representing the new contents of the editor
 *                                                            a boolean that's true if the editor is empty
 *                                                            a boolean that's true if the editor contents are too long
 *  @param {number} maxLength - the maximum allowed number of characters of the editor contents. Defaults to 14MB.
 *  @param {object} options - configuration options for the Quill editor. See https://quilljs.com/docs/quickstart/ and defaultOptions in class definition.
 */

export default Component.extend({
  classNames: ['quill-container'],
  utils: service('utility-methods'),

  isEmpty: true,
  isOverLengthLimit: false,

  defaultOptions: {
    debug: 'false',
    modules: {
      toolbar: [
        ['bold', 'italic', 'underline', 'strike'],
        [{ color: [] }, { background: [] }],
        [{ script: 'sub' }, { script: 'super' }],
        ['blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'formula'],
      ],
    },
    theme: 'snow',
    placeholder:
      'Type a detailed explanation here. This box will expand as you type.',
  },

  defaultMaxLength: 14680064, // 14MB

  didReceiveAttrs() {
    let attrSectionId = this.attrSectionId;
    if (!attrSectionId) {
      this.set('sectionId', 'editor');
    } else {
      this.set('sectionId', attrSectionId);
    }

    let limit = this.maxLength || this.defaultMaxLength;
    this.set('lengthLimit', limit);
  },

  didInsertElement() {
    let elId = this.elementId;
    let selector = `#${elId} section`;

    let options;
    if (!this.options) {
      options = this.defaultOptions;
    }
    options.bounds = selector;

    $(selector).ready(() => {
      let quill = new window.Quill(selector, options);
      this.set('quillInstance', quill);

      quill.on('text-change', (delta, oldDelta, source) => {
        this.handleQuillChange();
      });

      this.handleStartingText();
      this.handleQuillChange();
    });
    this._super(...arguments);
  },

  didUpdateAttrs() {
    this.handleStartingText();
  },

  willDestroyElement() {
    let quill = this.quillInstance;
    if (quill) {
      quill.off('text-change');
    }
    this._super(...arguments);
  },

  handleStartingText() {
    let attrStartingText = this.startingText;
    let startingText =
      typeof attrStartingText === 'string' ? attrStartingText : '';
    this.$('.ql-editor').html(startingText);
  },
  // Empty quill editor .html() property returns <p><br></p>
  // For quill to not be empty, there must either be some text or a student
  // must have uploaded an img so there must be an img tag
  isQuillNonEmpty() {
    let editor = this.$('.ql-editor');

    if (!editor) {
      return false;
    }
    let editorText = editor.text();
    let trimmed = typeof editorText === 'string' ? editorText.trim() : '';

    if (trimmed.length > 0) {
      return true;
    }

    let content = editor.html();
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

    let isOverLengthLimit = replaced.length > this.lengthLimit;
    this.set('isOverLengthLimit', isOverLengthLimit);

    this.onTextChange(replaced, isEmpty, isOverLengthLimit);
  },

  onTextChange(html, isEmpty, isOverLengthLimit) {
    if (this.onEditorChange) {
      this.onEditorChange(html, isEmpty, isOverLengthLimit);
    }
  },
});
