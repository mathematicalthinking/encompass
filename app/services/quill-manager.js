import Service from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

/**
 * QuillManager is a service that works with QuillContainer and QuillErrorBox. The service allows clients to inspect the
 * state of a Quill Editor (based on its id) -- whether it has any errors and its contents.
 * Clients can also include a QuillErrorBox in their hbs to display any
 * errors produced by the Quill Editor. Right now, there are only two errors: isEmpty and isOverflow (too long).  The
 * benefit of having this manager as a service is that if QuillContainers are updgraded to recognize other errors, the
 * client code will not need to change.
 */
export default class QuillManagerService extends Service {
  @tracked editorState = {};
  maxResponseLength = 14680064; // 14 MB NOTE: Must be the same as in QuillContainer (@TODO unacceptable tethering)

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
    return this.getIsEmpty(id) || this.getIsOverflow(id);
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
