// app/components/quill-container.js

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import Quill from 'quill';

export default class QuillContainerComponent extends Component {
  @service('utility-methods') utils;
  @service quillUtils;

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

  get sectionId() {
    return this.args.attrSectionId || 'editor';
  }

  get lengthLimit() {
    return this.args.maxLength || this.quillUtils.defaultMaxLength;
  }

  get tooLongErrorMsg() {
    const len = this.quillInstance?.root.innerHTML.length || 0;
    return this.quillUtils.formatTooLongErrorMsg(len, this.lengthLimit);
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

    // Show errors if validation enabled
    this.showEmptyError = this.args.showErrors && !isEmpty;
    this.showTooLongError = this.args.showErrors && isOverLengthLimit;

    if (this.args.onEditorChange) {
      this.args.onEditorChange(replaced, !isEmpty, isOverLengthLimit);
    }
  }

  isQuillNonEmpty() {
    return !this.quillUtils.isQuillContentEmpty(this.quillInstance);
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
