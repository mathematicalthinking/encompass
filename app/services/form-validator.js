Encompass.FormValidatorService = Ember.Service.extend({
  formId: null,
  inputs: [],
  requiredInputs: null,
  invalidInputs: null,
  isPristine: null, // if user has not interacted with form yet
  isDirty: Ember.computed.not('isPristine'), // if user has interacted
  isSubmitted: null, // true if user has tried to submit form

  setupListeners: function(formId) {
    var that = this;
    const $reqs = this.getRequiredInputs(formId);
    $reqs.each(function() {
      $(this).change(function() {
         that.reqInputOnChange($(this));
       });
     });
  },

  reqInputOnChange: function($el) {
    const id = this.get('formId');
    const $invalidInputs = this.getInvalidInputs(id);
    this.set('invalidInputs', $invalidInputs);
    if (this.get('isPristine')) {
      this.set('isPristine', false);
    }
    this.get('isValid');
    if (this.get('isSubmitted')) {
      this.handleRequiredInputErrors($el);
    }
  },

  handleRequiredInputErrors: function($el) {
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
      isElInvalid = Ember.isEmpty($el.val());
      if (isElInvalid) {
        $el.toggleClass('required-error', true);
      } else {
        $el.toggleClass('required-error', false);
      }
    }

    this.get('checkForm')();
  },

  init() {
    this._super(...arguments);
    console.log('initializing form validator');
  },

  initialize: function(formId, isMissing) {
    this.set('formId', formId);
    this.set('isPristine', true);
    this.set('isSubmitted', false);
    this.set('checkForm', isMissing);
    this.setupListeners(formId);
  },

  isValid: function() {
    console.log('computing isValid');
    if(this.get('isPristine')) {
      return false;
    }
    const id = this.get('formId');
    const $invalids = this.getInvalidInputs(id);

    return this.get('isDirty') && Ember.isEmpty($invalids);
  }.property('invalidInputs.[]', 'isPristine'),

  isInvalid: Ember.computed('isDirty', 'isValid', function() {
    return this.get('isDirty') && !this.get('isValid');
  }),

  isMissingRequiredFields: function(id) {
    return this.getInvalidInputs(id).length > 0;
  },
  getRequiredInputs: function(formId) {
    const $form = $(formId);
    if (!$form) {
      return;
    }
    let reqs = $form.find("input[required]");

    this.set('requiredInputs', reqs);
    return reqs;
  },

  getInvalidInputs: function(formId) {
    let $invalids = this.getRequiredInputs(formId)
      .filter(function(ix, inp) {
        let val = $(this).val();
        return Ember.isEmpty(val);
      });
      this.set('invalidInputs', $invalids);
      return $invalids;
  },
  // run on form submit
  validate: function(formId) {
    var that = this;
    return new Promise((resolve, reject) => {
      let ret = {};
      if (!formId) {
        return reject(new Error('Invalid form id!'));
      }

      if (!this.get('isSubmitted')) {
        this.set('isSubmitted', true);
      }

      ret.isValid = this.get('isValid');

      if (ret.isValid) {
        return resolve(ret);
      }
      // else form is Invalid; handle errors
      ret.invalidInputs = this.getInvalidInputs(formId);
      ret.invalidInputs.each(function() {
        that.handleRequiredInputErrors($(this));
      });

      return resolve(ret);
    });
  },
});