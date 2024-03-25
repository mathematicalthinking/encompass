import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

/**
 * QuillErrorBox works in conjunction with QuillContainer and the qullManager service. It displays whatever
 * errors the QuillContainer generates.
 */
export default class QuillErrorBox extends Component {
  @service quillManager;

  get hasErrors() {
    return this.quillManager.hasErrors(this.args.quillEditorId);
  }

  get errors() {
    return this.quillManager.getErrorMsgs(this.args.quillEditorId);
  }
}
