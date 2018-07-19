Encompass.FormValidatorService = Ember.Service.extend({
  componentForm: null,
  inputs: [],

  init() {
    this._super(...arguments);
    console.log('initializing form validator');
    console.log('this', this);
  },

  setupListeners: function(formId, fn) {
    const $form = $(formId);
    const reqs = this.getRequiredInputs($form);
    reqs.on('keyup', function(e) {
      fn();
    });
  },

  verifyFormState: function(formId) {
    let $form = $(formId);

    let invalidInputs = this.getInvalidInputs($form);
    console.log('invalids', invalidInputs);
    let isClean = invalidInputs.length === 0;
    console.log('is form clean?', isClean);
    if (isClean) {
      if ($form.hasClass('required-error')) {
        $form.removeClass('required-error');
      }
    } else {
      if (!$form.hasClass('required-error')) {
        $form.addClass('required-error');
        //$form.append('<p class="error-message">Error</p>');
      }
    }
    //return this.isMissingRequiredFields(formId);
  },

  isMissingRequiredFields: function(id) {
    const $form = $(id);
    console.log('in is missing val', $form.hasClass('required-error'));
    return this.getInvalidInputs($form).length > 0;
  },
  getRequiredInputs: function(form) {
    if (!form) {
      return;
    }
    return form.find("input[required]");
  },

  getInvalidInputs: function(form) {
    return this.getRequiredInputs(form)
      .filter(function(ix, inp) {
        let val = $(this).val();
        console.log('val', val);
        return val === null || val === undefined || val === '';
      });
  },

  validate: function(formId) {
    this.set('formId', formId);
    const that = this;
    return new Promise((resolve, reject) => {
      let ret = {};
      let isFormValid;

      if (!formId) {
        return reject('Invalid Arguments');
      }

    const $form = $(formId);
    console.log('validating form: ', $form);

    const $inputs = $form.find('input');
    const $requiredInputs = $form.find("input[required]");
    const $invalidInputs = $requiredInputs.filter(function(index, inp) {
      console.log('index', index);
      console.log('inp',inp);
      console.log('$(this): ', $(this));
      let val = $(this).val();
      console.log('val', val);
      return Ember.isEmpty(val);
    });

    isFormValid = Ember.isEmpty($invalidInputs);
    ret.isValid = isFormValid;

    if (isFormValid) {
      return resolve(ret);
    }

    //handle errors
    return that.handleRequiredFieldErrors($invalidInputs, formId)
      .then(() => {
        ret.didSetRequiredFieldErrors = true;
        return resolve(ret);
      })
      .catch((err) => {
        console.log(err);
        ret.didSetRequiredFieldErrors = false;
        return reject(ret);
      });
    });
  },

  handleRequiredFieldErrors: function(arr, id) {
    const that = this;
    const $form = $(id);
    return new Promise((resolve, reject) => {
      if (!arr) {
        return reject('Invalid arguments');
      }
      let $inputs = arr;

      // add error class to each input
      console.log('adding classes');
      $form.addClass('required-error');
      $inputs.addClass('required-error');
      $inputs.on('keyup', function(e) {
        console.log('e', e);
        if ($(this).hasClass('required-error')) {
          $(this).removeClass('required-error');
          $(this).off('keyup');
        }
        that.verifyFormState(that.get('formId'));
      });
      return resolve(true);
    });

  },





});