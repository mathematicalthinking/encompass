import { computed } from '@ember/object';
import { not } from '@ember/object/computed';
import Service from '@ember/service';
import { isEmpty } from '@ember/utils';
import $ from 'jquery';

export default Service.extend({
  formId: null,
  inputs: [],
  requiredInputs: null,
  invalidInputs: null,
  isPristine: null, // if user has not interacted with form yet
  isDirty: not('isPristine'), // if user has interacted
  isSubmitted: null, // true if user has tried to submit form

  setupListeners: function (formId) {
    var that = this;
    const $reqs = this.getRequiredInputs(formId);
    $reqs.each(function () {
      $(this).change(function () {
        that.reqInputOnChange($(this));
      });
    });
  },

  reqInputOnChange: function ($el) {
    const id = this.formId;
    const $invalidInputs = this.getInvalidInputs(id);
    this.set('invalidInputs', $invalidInputs);
    if (this.isPristine) {
      this.set('isPristine', false);
    }
    this.isValid;
    if (this.isSubmitted) {
      this.handleRequiredInputErrors($el);
    }
  },

  handleRequiredInputErrors: function ($el) {
    let isElInvalid;

    if ($el.is(':radio')) {
      let name = $el.attr('name');
      let $radioSet = $(`input[name=${name}]`);
      let isSetInvalid = $(`input[name=${name}]:checked`).length === 0;

      if (isSetInvalid) {
        $radioSet.toggleClass('required-error', true);
      } else {
        $radioSet.toggleClass('required-error', false);
      }
    } else {
      isElInvalid = isEmpty($el.val());
      if (isElInvalid) {
        $el.toggleClass('required-error', true);
      } else {
        $el.toggleClass('required-error', false);
      }
    }

    this.checkForm();
  },

  init() {
    this._super(...arguments);
  },

  initialize: function (formId, isMissing) {
    this.set('formId', formId);
    this.set('isPristine', true);
    this.set('isSubmitted', false);
    this.set('checkForm', isMissing);
    this.setupListeners(formId);
  },

  isValid: computed('invalidInputs.[]', 'isPristine', function () {
    if (this.isPristine) {
      return false;
    }
    const id = this.formId;
    const $invalids = this.getInvalidInputs(id);

    return this.isDirty && isEmpty($invalids);
  }),

  isInvalid: computed('isDirty', 'isValid', function () {
    return this.isDirty && !this.isValid;
  }),

  isMissingRequiredFields: function (id) {
    return this.getInvalidInputs(id).length > 0;
  },

  getInputs: function (formId) {
    const $form = $(formId);
    let $inputs = $form.find('input');
    return $inputs;
  },

  getRequiredInputs: function (formId) {
    const $form = $(formId);
    if (!$form) {
      return;
    }
    let reqs = $form.find('input[required]');

    this.set('requiredInputs', reqs);
    return reqs;
  },

  getInvalidInputs: function (formId) {
    let $invalids = this.getRequiredInputs(formId).filter(function (ix, inp) {
      let val = $(this).val();
      return isEmpty(val);
    });
    this.set('invalidInputs', $invalids);
    return $invalids;
  },
  // run on form submit
  validate: function (formId) {
    var that = this;
    // eslint-disable-next-line no-undef
    return new Promise((resolve, reject) => {
      let ret = {};
      if (!formId) {
        return reject(new Error('Invalid form id!'));
      }

      if (!this.isSubmitted) {
        this.set('isSubmitted', true);
      }

      ret.isValid = this.isValid;

      if (ret.isValid) {
        return resolve(ret);
      }
      // else form is Invalid; handle errors
      ret.invalidInputs = this.getInvalidInputs(formId);
      ret.invalidInputs.each(function () {
        that.handleRequiredInputErrors($(this));
      });

      return resolve(ret);
    });
  },

  clearForm: function () {
    this.set('isPristine', true);
    let $inputs = this.getInputs(this.formId);
    $inputs.each(function () {
      if ($(this).is(':radio') || $(this).is(':checkbox')) {
        $(this).prop('checked', false);
      } else if ($(this).is(':text')) {
        $(this).val('');
      } else {
        $(this).val(null);
      }
    });
  },
});
