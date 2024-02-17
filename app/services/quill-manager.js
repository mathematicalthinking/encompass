import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class QuillManagerService extends Service {
  @tracked editorState = {};
  maxResponseLength = 14680064;

  getQuillErrors(id) {
    let errors = [];
    if (this.editorState[id].isEmpty) {
      errors.push('emptyReplyError');
    }
    if (this.editorState[id].isOverflow) {
      errors.push('quillTooLongError');
    }
    return errors;
  }

  returnSizeDisplay(bytes) {
    if (bytes < 1024) {
      return bytes + ' bytes';
    } else if (bytes >= 1024 && bytes < 1048576) {
      return (bytes / 1024).toFixed(1) + 'KB';
    } else if (bytes >= 1048576) {
      return (bytes / 1048576).toFixed(1) + 'MB';
    }
  }

  getQuillTooLongErrorMsg(id) {
    let len = this.getHtml(id).length;
    let maxLength = this.maxResponseLength;
    let maxSizeDisplay = this.returnSizeDisplay(maxLength);
    let actualSizeDisplay = this.returnSizeDisplay(len);

    return `The total size of your response (${actualSizeDisplay}) exceeds the maximum limit of ${maxSizeDisplay}. Please remove or resize any large images and try again.`;
  }

  hasErrors(id) {
    return this.editorState[id].isEmpty || this.editorState[id].isOverflow;
  }

  getHtml(id) {
    return this.editorState[id]?.html ?? '';
  }

  getIsEmpty(id) {
    return this.editorState[id]?.isEmpty ?? false;
  }

  getIsOverflow(id) {
    return this.editorState[id]?.isOverflow ?? false;
  }

  getErrorMsgs(id) {
    const errors = [];
    if (this.getIsEmpty(id)) errors.push('Message body cannot be empty.');
    if (this.getIsOverflow(id)) errors.push(this.getQuillTooLongErrorMsg(id));
    return errors;
  }

  _updateEditorState(id, changes) {
    const newState = { ...this.editorState[id], ...changes };

    this.editorState = { ...this.editorState, [id]: newState };
  }

  @action
  onEditorChange(id, html = '', isEmpty = false, isOverflow = false) {
    if (id && typeof id === 'string') {
      this._updateEditorState(id, { html, isEmpty, isOverflow });
    }
  }

  @action
  clearEditor(id) {
    const { [id]: removed, ...rest } = this.editorState;
    this.editorState = rest;
  }
}
