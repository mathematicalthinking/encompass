import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class ErrorHandlingService extends Service {
  @service('sweet-alert') alert;

  errors = {};

  isAdapterError(err) {
    if (!err) {
      return;
    }
    return err.isAdapterError;
  }

  isRecordInvalid(record) {
    if (!record) {
      return;
    }
    return !record.get('isValid');
  }

  setErrorMessages(err, propName) {
    if (!err || !propName) {
      return;
    }

    let errors = err.errors;
    if (!errors || !Array.isArray(errors)) {
      this.errors[propName] = ['Unknown Error'];
      return;
    }
    let details = errors.map((e) => e.detail);
    this.errors[propName] = details;
    return;
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
          if (this.errors[e]) {
            this.errors[e] = null;
          }
        }
      }
    } else {
      if (typeof err !== 'string') {
        return;
      }
      if (this.errors[err]) {
        this.errors[err] = null;
      }
    }
  }

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

  @action
  removeErrorFromArray(prop, err) {
    if (!this.errors[prop]) {
      return;
    }
    this.errors[prop].splice(this.errors[prop].indexOf(err), 1);
    return;
  }
}
