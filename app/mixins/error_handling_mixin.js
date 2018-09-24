Encompass.ErrorHandlingMixin = Ember.Mixin.create({
  isAdapterError: function(err) {
    if (!err) {
      return;
    }
    return err.isAdapterError === true;
  },

  isRecordInvalid: function(rec) {
    if (!rec) {
      return;
    }
    return rec.get('isValid') === false;
  },

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

  handleErrors: function(err, propName, record=null) {
    this.setErrorMessages(err, propName);

    if (record) {
      if (this.isRecordInvalid(record)) {
        record.rollbackAttributes();
      }
    }

  }

});