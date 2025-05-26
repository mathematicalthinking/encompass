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

  get sectionId() {
    return this.args.attrSectionId || 'editor';
  }

  get lengthLimit() {
    return this.args.maxLength || this.defaultMaxLength;
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
    if (this.quillInstance && typeof this.args.startingText === 'string') {
      this.quillInstance.root.innerHTML = this.args.startingText;
    }
  }

  handleQuillChange() {
    if (!this.quillInstance) return;

    const htmlContents = this.quillInstance.root.innerHTML;
    const replaced = htmlContents.replace(/"/g, "'");

    const isEmpty = this.isQuillNonEmpty();
    const isOverLengthLimit = replaced.length > this.lengthLimit;

    this.isEmpty = !isEmpty;
    this.isOverLengthLimit = isOverLengthLimit;

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
}
