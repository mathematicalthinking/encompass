import Service from '@ember/service';
import { isEmpty } from '@ember/utils';
import { tracked } from '@glimmer/tracking';
import $ from 'jquery';

export default class FormValidatorService extends Service {
  @tracked formId = null;
  @tracked inputs = [];
  @tracked requiredInputs = null;
  @tracked invalidInputs = null;
  @tracked isPristine = null;
  @tracked isSubmitted = null;

  checkForm = () => {};

  get isDirty() {
    return !this.isPristine;
  }

  get isValid() {
    if (this.isPristine) {
      return false;
    }

    const invalidInputs = this.getInvalidInputs(this.formId);
    return this.isDirty && invalidInputs.length === 0;
  }

  get isInvalid() {
    return this.isDirty && !this.isValid;
  }

  setupListeners(formId) {
    const requiredInputs = this.getRequiredInputs(formId);

    requiredInputs
      .off('change.form-validator')
      .on('change.form-validator', (event) => {
        this.reqInputOnChange($(event.currentTarget));
      });
  }

  reqInputOnChange($element) {
    this.invalidInputs = this.getInvalidInputs(this.formId);

    if (this.isPristine) {
      this.isPristine = false;
    }

    if (this.isSubmitted) {
      this.handleRequiredInputErrors($element);
    }
  }

  handleRequiredInputErrors($element) {
    if ($element.is(':radio')) {
      const name = $element.attr('name');
      const $radioSet = $(`input[name=${name}]`);
      const isSetInvalid = $(`input[name=${name}]:checked`).length === 0;

      $radioSet.toggleClass('required-error', isSetInvalid);
    } else {
      $element.toggleClass('required-error', isEmpty($element.val()));
    }

    this.checkForm();
  }

  initialize(formId, checkForm) {
    this.formId = formId;
    this.isPristine = true;
    this.isSubmitted = false;
    this.checkForm = checkForm || (() => {});
    this.setupListeners(formId);
  }

  isMissingRequiredFields(formId) {
    return this.getInvalidInputs(formId).length > 0;
  }

  getInputs(formId) {
    return $(formId).find('input');
  }

  getRequiredInputs(formId) {
    const requiredInputs = $(formId).find('input[required]');
    this.requiredInputs = requiredInputs;
    return requiredInputs;
  }

  getInvalidInputs(formId) {
    const invalidInputs = this.getRequiredInputs(formId).filter(function () {
      return isEmpty($(this).val());
    });

    this.invalidInputs = invalidInputs;
    return invalidInputs;
  }

  validate(formId) {
    return new Promise((resolve, reject) => {
      if (!formId) {
        reject(new Error('Invalid form id!'));
        return;
      }

      this.isSubmitted = true;

      const result = {
        isValid: this.isValid,
      };

      if (result.isValid) {
        resolve(result);
        return;
      }

      result.invalidInputs = this.getInvalidInputs(formId);
      result.invalidInputs.each((_index, element) => {
        this.handleRequiredInputErrors($(element));
      });

      resolve(result);
    });
  }

  clearForm() {
    this.isPristine = true;

    this.getInputs(this.formId).each(function () {
      const $input = $(this);

      if ($input.is(':radio') || $input.is(':checkbox')) {
        $input.prop('checked', false);
      } else if ($input.is(':text')) {
        $input.val('');
      } else {
        $input.val(null);
      }
    });
  }
}
