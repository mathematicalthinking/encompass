import { computed } from '@ember/object';
import Mixin from '@ember/object/mixin';
import { isEmpty } from '@ember/utils';

export default Mixin.create({
  emailRegEx: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
  usernameRegEx: /^[a-z0-9_]{3,30}$/,
  passwordMinLength: 10,
  passwordMaxLength: 72,
  passwordError: null,
  usernameError: null,
  emailError: null,

  isEmailDirty: false,
  isPasswordDirty: false,

  emailErrors: {
    invalid: 'Invalid email address.',
    missing: 'Email is required',
    mismatch: 'Emails do not match.',
    taken: 'Email address has already been used',
  },
  usernameErrors: {
    invalid:
      'Username must be all lowercase, at least 3 characters and can only contain the following special characters _',
    missing: 'Username is required',
    taken: 'Username already exists',
  },

  passwordErrors: {
    invalid: 'Password must be between 10 and 72 characters long',
    missing: 'Password is required',
    mismatch: 'Passwords do not match',
  },

  isEmailRequired: computed('selectedType', function () {
    return this.selectedType !== 'Student';
  }),

  isEmailValid: computed('email', 'isEmailDirty', function () {
    let email = this.email;

    if (!this.isEmailDirty && !isEmpty(email)) {
      this.set('isEmailDirty', true);
    }
    return this.validateEmail(email);
  }),

  // We don't want error being displayed when form loads initially
  isEmailInvalid: computed('isEmailValid', 'isEmailDirty', function () {
    return this.isEmailDirty && !this.isEmailValid;
  }),

  doEmailsMatch: computed('email', 'confirmEmail', function () {
    return this.email === this.confirmEmail;
  }),

  isPasswordValid: computed(
    'password',
    'isPasswordValid',
    'passwordMinLength',
    'passwordMaxLength',
    function () {
      if (!this.isPasswordDirty && !isEmpty(this.password)) {
        this.set('isPasswordDirty', true);
      }
      //TODO: stricter password req
      if (isEmpty(this.password)) {
        return false;
      }
      let length = this.password.length;
      let min = this.passwordMinLength;
      let max = this.passwordMaxLength;

      return length >= min && length <= max;
    }
  ),

  isPasswordInvalid: computed(
    'isPasswordValid',
    'isPasswordDirty',
    function () {
      return this.isPasswordDirty && !this.isPasswordValid;
    }
  ),

  doPasswordsMatch: computed('password', 'confirmPassword', function () {
    return this.password === this.confirmPassword;
  }),

  validateEmail: function (email) {
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(this.emailRegEx);
    return emailPattern.test(email);
  },

  actions: {
    usernameValidate(username) {
      if (username) {
        var usernamePattern = new RegExp(this.usernameRegEx);
        var usernameTest = usernamePattern.test(username);

        if (usernameTest === false) {
          this.set('usernameError', this.usernameErrors.invalid);
          return;
        }

        if (usernameTest === true) {
          // this.set('incorrectUsername', false);
          this.set('usernameError', null);
          this.set('missingCredentials', false);
          this.set('username', username);
          return;
        }
      }
    },

    emailValidate(email) {
      let isValid = this.validateEmail(email);
      if (isValid) {
        this.set('emailError', null);
        this.set('email', email);
      } else {
        this.set('emailError', this.emailErrors.invalid);
      }
    },
    passwordValidate: function (password) {
      function hasWhiteSpace(string) {
        return /\s/g.test(string);
      }

      if (
        password.length < this.passwordMinLength ||
        password.length > this.passwordMaxLength
      ) {
        this.set('passwordError', this.passwordErrors.invalid);
      } else {
        this.set('passwordError', null);

        this.set('password', password);
      }

      if (hasWhiteSpace(password)) {
        this.set('noSpacesError', true);
      } else {
        this.set('noSpacesError', false);
        this.set('password', password);
      }
    },
    resetErrors(e) {
      const errors = [
        'missingCredentials',
        'noTermsAndConditions',
        'usernameError',
        'emailError',
        'passwordError',
        'errorMessage',
        'emailExistsError',
        'postErrors',
      ];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  },
});
