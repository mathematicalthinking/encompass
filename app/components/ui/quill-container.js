// app/components/quill-container.js

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Quill from 'quill';

export default class QuillContainerComponent extends Component {
  @service('utility-methods') utils;

  @tracked quillInstance = null;
  @tracked isEmpty = true;
  @tracked isOverLengthLimit = false;
  @tracked showEmptyError = false;
  @tracked showTooLongError = false;

  defaultOptions = {
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
  };

  defaultMaxLength = 14680064; // 14MB
  defaultEmptyErrorMessage = 'Please enter a response before submitting.';

  get sectionId() {
    return this.args.attrSectionId || 'editor';
  }

  get lengthLimit() {
    return this.args.maxLength || this.defaultMaxLength;
  }

  get emptyErrorMsg() {
    return this.args.emptyErrorMessage || this.defaultEmptyErrorMessage;
  }

  get tooLongErrorMsg() {
    const len = this.quillInstance?.root.innerHTML.length || 0;
    const maxSizeDisplay = this.returnSizeDisplay(this.lengthLimit);
    const actualSizeDisplay = this.returnSizeDisplay(len);
    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
  }

  @action
  setupQuill(element) {
    const options = this.args.options || this.defaultOptions;
    options.bounds = element;

    const quill = new Quill(element, options);
    this.quillInstance = quill;

    quill.on('text-change', this.handleQuillChange.bind(this));

    this.handleStartingText();
    this.handleQuillChange();
  }

  @action
  teardownQuill() {
    if (this.quillInstance) {
      this.quillInstance.off('text-change');
      this.quillInstance = null;
    }
  }

  handleStartingText() {
    if (!this.quillInstance) return;

    const startingText = this.args.startingText;
    if (!startingText) return;

    // Convert old format (plain text) to Quill format if needed
    if (this.isOldFormatText(startingText)) {
      this.quillInstance.setText(startingText);
    } else if (typeof startingText === 'string') {
      this.quillInstance.root.innerHTML = startingText;
    }
  }

  isOldFormatText(text) {
    if (!text) return false;
    const parsed = new DOMParser().parseFromString(text, 'text/html');
    return !Array.from(parsed.body.childNodes).some(
      (node) => node.nodeType === 1
    );
  }

  handleQuillChange() {
    if (!this.quillInstance) return;

    const htmlContents = this.quillInstance.root.innerHTML;
    const replaced = htmlContents.replace(/"/g, "'");

    const isEmpty = this.isQuillNonEmpty();
    const isOverLengthLimit = replaced.length > this.lengthLimit;

    this.isEmpty = !isEmpty;
    this.isOverLengthLimit = isOverLengthLimit;

    // Show errors if validation enabled
    this.showEmptyError = this.args.showErrors && !isEmpty;
    this.showTooLongError = this.args.showErrors && isOverLengthLimit;

    if (this.args.onEditorChange) {
      this.args.onEditorChange(replaced, !isEmpty, isOverLengthLimit);
    }
  }

  isQuillNonEmpty() {
    if (!this.quillInstance) return false;
    const text = this.quillInstance.getText().trim();
    if (text.length > 0) return true;
    const content = this.quillInstance.root.innerHTML;
    return content.includes('<img');
  }

  returnSizeDisplay(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + 'KB';
    return (bytes / 1048576).toFixed(1) + 'MB';
  }

  @action
  resetEmptyError() {
    this.showEmptyError = false;
  }

  @action
  resetTooLongError() {
    this.showTooLongError = false;
  }
}
