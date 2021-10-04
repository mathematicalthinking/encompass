import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ErrorHandlingComponent extends Component {
  @service('sweet-alert') alert;

  isAdapterError(err) {
    if (!err) {
      return;
    }
    return err.isAdapterError === true;
  }

  isRecordInvalid(rec) {
    if (!rec) {
      return;
    }
    return rec.get('isValid') === false;
  }

  setErrorMessages(err, propName) {
    if (!err || !propName) {
      return;
    }

    let errors = err.errors;
    if (!errors || !Array.isArray(errors)) {
      this.propName = ['Unknown Error'];
      return;
    }
    let details = errors.map((e) => e.detail);
    this[propName] = details;
  }

  handleErrors(err, propName, record = null, records = []) {
    this.setErrorMessages(err, propName);

    if (record) {
      if (this.isRecordInvalid(record)) {
        record.rollbackAttributes();
      }
    }
    if (records) {
      records.forEach((record) => {
        if (this.isRecordInvalid(record)) {
          record.rollbackAttributes();
        }
      });
    }
  }

  removeMessages(...errors) {
    for (let e of errors) {
      this._removeMessages(e);
    }
  }
  _removeMessages(err) {
    if (!err) {
      return;
    }

    if (Array.isArray(err)) {
      for (let e of err) {
        if (typeof e === 'string') {
          if (this[e]) {
            this[e] = null;
          }
        }
      }
    } else {
      if (typeof err !== 'string') {
        return;
      }
      if (this[err]) {
        this[err] = null;
      }
    }
  }

  // extracts first error detail from errors array and uses
  // sweet-alert to display toast
  displayErrorToast(err, recordsToRollback) {
    if (!err) {
      return;
    }
    let msg;

    let errors = err.errors;

    if (Array.isArray(errors) && errors.length > 0) {
      let firstError = errors[0];
      if (firstError) {
        msg = errors[0].detail || 'Unknown Error';
      }
    }

    let records = Array.isArray(recordsToRollback)
      ? recordsToRollback
      : [recordsToRollback];

    records.forEach((rec) => {
      if (this.isRecordInvalid(rec)) {
        rec.rollbackAttributes();
      }
    });

    this.alert.showToast('error', msg, 'bottom-end', 5000, false, null);
  }

  @action removeErrorFromArray(prop, err) {
    if (!this[prop]) {
      return;
    }
    this[prop].removeObject(err);
  }
}
