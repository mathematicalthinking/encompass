import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { TrackedObject } from 'tracked-built-ins';

/**
 * A service for collecting, storing, and auto-clearing error messages,
 * plus optional record rollback and SweetAlert toasts.
 */
export default class ErrorHandlingService extends Service {
  /**
   * The SweetAlert service for showing error toasts, etc.
   */
  @service('sweet-alert') alert;

  /**
   * Store of all errors, keyed by a property name (e.g., "problemLoadErrors").
   * Using a TrackedObject so that updates remain reactive in templates.
   */
  @tracked errors = new TrackedObject({});

  /**
   * Delays (in ms) after which errors are automatically removed for a given key.
   * 3 minutes = 180_000.
   */
  AUTO_CLEAR_DELAY = 180_000;

  /**
   * Map of propName -> setTimeout handle for auto-clear timers.
   */
  _autoClearTimers = {};

  // ---------------------------------------------------------------------------
  // PUBLIC METHODS (API)
  // ---------------------------------------------------------------------------

  /**
   * Store error messages for `propName`, rolling back the given record(s) if invalid.
   * @param {Object} err - The error object (may contain `errors` array, etc.).
   * @param {string} propName - The key under which to store these errors.
   * @param {DS.Model|null} record - A single record to possibly rollback.
   * @param {Array<DS.Model>} records - Additional records to possibly rollback.
   */
  handleErrors(err, propName, record = null, records = []) {
    this._setErrorMessages(err, propName);

    if (record && this._isRecordInvalid(record)) {
      record.rollbackAttributes();
    }

    if (records) {
      records.forEach((r) => {
        if (this._isRecordInvalid(r)) {
          r.rollbackAttributes();
        }
      });
    }
  }

  /**
   * Retrieve the error array for a given key (e.g., "problemLoadErrors").
   * @param {string} prop - Key at which errors are stored.
   * @returns {Array<string>|undefined} - Array of error messages (or undefined if none).
   */
  getErrors(prop) {
    return this.errors[prop];
  }

  /**
   * Remove error messages for the given key(s).
   * e.g., removeMessages('problemLoadErrors') or removeMessages('foo', 'bar').
   * @param {...string|Array<string>} errors - One or more keys (or an array of keys).
   */
  removeMessages(...errors) {
    for (const e of errors) {
      this._removeMessages(e);
    }
  }

  /**
   * Display an error toast (via SweetAlert) and optionally rollback invalid records.
   * @param {Object} err - The error object (may contain `errors` array, etc.).
   * @param {DS.Model|Array<DS.Model>} recordsToRollback - One or more records to rollback.
   */
  displayErrorToast(err, recordsToRollback) {
    if (!err) {
      return;
    }

    let msg;
    const { errors } = err;

    if (Array.isArray(errors) && errors.length > 0) {
      const firstError = errors[0];
      if (firstError) {
        msg = firstError.detail || 'Unknown Error';
      }
    }

    const records = Array.isArray(recordsToRollback)
      ? recordsToRollback
      : [recordsToRollback];

    records.forEach((rec) => {
      if (this._isRecordInvalid(rec)) {
        rec.rollbackAttributes();
      }
    });

    this.alert.showToast('error', msg, 'bottom-end', 5000, false, null);
  }

  /**
   * Remove a single error string from the array stored at `prop`.
   * If removing it empties the array, remove the key entirely (and cancel the auto-clear timer).
   * @param {string} prop - The key under which the error array lives.
   * @param {string} err - The error string to remove from the array.
   */
  removeErrorFromArray(prop, err) {
    if (!this.errors[prop]) {
      return;
    }

    const idx = this.errors[prop].indexOf(err);
    if (idx !== -1) {
      this.errors[prop].splice(idx, 1);
    }

    if (this.errors[prop].length === 0) {
      delete this.errors[prop];
      this._cancelTimerFor(prop);
    }
  }

  // ---------------------------------------------------------------------------
  // PRIVATE METHODS
  // ---------------------------------------------------------------------------

  /**
   * Checks if a record is invalid. We assume `.isValid` is a property on the model.
   * @param {DS.Model} record
   * @returns {boolean}
   */
  _isRecordInvalid(record) {
    return !record?.isValid ?? false;
  }

  /**
   * Sets error messages for a given key, parsing the error object.
   * Schedules an auto-clear timer for that key.
   * @param {Object} err - The error object
   * @param {string} propName - Key under which to store errors
   */
  _setErrorMessages(err, propName) {
    if (!err || !propName) {
      return;
    }

    if (err.errors && Array.isArray(err.errors)) {
      // Typically an array of { detail: 'Message...' }
      const details = err.errors.map((e) => {
        if (typeof e.detail === 'object') {
          console.log('Error detail object:', e.detail);
        }
        return e.detail;
      });
      this.errors[propName] = details;
    } else if (typeof err.message === 'string') {
      this.errors[propName] = [err.message];
    } else {
      this.errors[propName] = ['Unknown Error'];
    }

    this._restartAutoClearTimer(propName);
  }

  /**
   * Internal helper used by removeMessages(...).
   * Accepts either a single string key or an array of string keys.
   */
  _removeMessages(propOrProps) {
    if (!propOrProps) {
      return;
    }

    if (Array.isArray(propOrProps)) {
      propOrProps.forEach((key) => this._clearErrorsForKey(key));
    } else {
      this._clearErrorsForKey(propOrProps);
    }
  }

  /**
   * Clears all errors at a particular key and cancels its auto-clear timer.
   * @param {string} key
   */
  _clearErrorsForKey(key) {
    if (typeof key !== 'string') {
      return;
    }

    if (this.errors[key]) {
      delete this.errors[key];
      this._cancelTimerFor(key);
    }
  }

  /**
   * Cancel any existing timer for a given key and start a fresh one.
   * If no errors are added before it fires, that key is auto-removed.
   * @param {string} key
   */
  _restartAutoClearTimer(key) {
    this._cancelTimerFor(key);

    this._autoClearTimers[key] = setTimeout(() => {
      if (this.errors[key]) {
        delete this.errors[key];
      }
      delete this._autoClearTimers[key];
    }, this.AUTO_CLEAR_DELAY);
  }

  /**
   * Cancels the timer for a particular key (if it exists), then deletes it from the map.
   * @param {string} key
   */
  _cancelTimerFor(key) {
    if (this._autoClearTimers[key]) {
      clearTimeout(this._autoClearTimers[key]);
      delete this._autoClearTimers[key];
    }
  }
}
