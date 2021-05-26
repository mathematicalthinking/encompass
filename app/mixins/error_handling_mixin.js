// throughout app
Encompass.ErrorHandlingMixin = Ember.Mixin.create({

  alert: Ember.inject.service('sweet-alert'),
//only found here
  isAdapterError: function(err) {
    if (!err) {
      return;
    }
    return err.isAdapterError === true;
  },
// only found here
  isRecordInvalid: function(rec) {
    if (!rec) {
      return;
    }
    return rec.get('isValid') === false;
  },
//only found here
  setErrorMessages: function(err, propName) {
    if (!err || !propName) {
      return;
    }

    let errors = err.errors;
    if (!errors || !Array.isArray(errors)) {
      this.set(propName, ["Unknown Error"]);
      return;
    }
    let details = errors.map(e => e.detail);
    this.set(propName, details);
  },
//throughout app
  handleErrors: function(err, propName, record=null, records=[]) {
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
  },
//throughout app
  removeMessages: function(...errors) {

    for (let e of errors) {
      this._removeMessages(e);
    }
  },
  _removeMessages: function(err) {
    if (!err) {
      return;
    }

    if (Array.isArray(err)) {
      for (let e of err) {
        if (typeof e === 'string') {
          if (this.get(e)) {
            this.set(e, null);
          }
        }
      }
    } else {
      if (typeof err !== 'string') {
        return;
      }
      if (this.get(err)) {
        this.set(err, null);
      }
    }
  },

  // extracts first error detail from errors array and uses
  // sweet-alert to display toast
  //only in response-approver-reply.js
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

    let records = Array.isArray(recordsToRollback) ? recordsToRollback : [recordsToRollback];

    records.forEach((rec) => {
      if (this.isRecordInvalid(rec)) {
        rec.rollbackAttributes();
      }
    });

    this.get('alert').showToast('error', msg, 'bottom-end', 5000, false, null);

  },

  actions: {
    removeErrorFromArray(prop, err) {
      if (!this.get(prop)) {
        return;
      }
      this.get(prop).removeObject(err);
    }
  },

});