import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ImportWorkStep3Component extends Component {
  @service store;

  @tracked missingFiles = false;

  @action
  next() {
    if (this.args.uploadedFiles?.length > 0) {
      this.args.onProceed(this.args.uploadedFiles);
    } else {
      this.missingFiles = true;
    }
  }

  @action
  back() {
    this.args.onBack(-1);
  }

  @action
  updateCurrentFiles(files) {
    if (!files) {
      return;
    }

    for (let f of files) {
      this.args.uploadedFiles.addObject(f);
    }
  }

  @action
  removeFile(file) {
    if (!file) {
      return;
    }
    this.args.uploadedFiles.removeObject(file);

    // destroy unnecessary image record
    const fileId =
      file.id ||
      file._id ||
      (typeof file.get === 'function' ? file.get('id') : null);
    if (!fileId) {
      return;
    }
    const peeked = this.store.peekRecord('image', fileId);
    if (peeked) {
      peeked.destroyRecord();
    }
  }

  @action
  resetMissingFiles() {
    this.missingFiles = false;
  }
}
