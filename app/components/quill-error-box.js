import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class QuillErrorBox extends Component {
  @service quillManager;

  get hasErrors() {
    return this.quillManager.hasErrors(this.args.quillEditorId);
  }

  get errors() {
    return this.quillManager.getErrorMsgs(this.args.quillEditorId);
  }
}
