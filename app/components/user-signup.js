import ErrorHandlingComponent from './error-handling';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UserSignupComponent extends ErrorHandlingComponent {
  emailRegEx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  usernameRegEx = /^[a-z0-9_]{3,30}$/;
  passwordMinLength = 10;
  passwordMaxLength = 72;
  @tracked passwordError = null;
  @tracked usernameError = null;
  @tracked emailError = null;
  @tracked isEmailDirty = false;
  @tracked isEmailValid = false;
  @tracked email = '';
  @tracked isEmailDirty = false;
  @tracked confirmEmail = null;

  emailErrors = {
    invalid: 'Invalid email address.',
    missing: 'Email is required',
    mismatch: 'Emails do not match.',
    taken: 'Email address has already been used',
  };
  usernameErrors = {
    invalid:
      'Username must be all lowercase, at least 3 characters and can only contain the following special characters _',
    missing: 'Username is required',
    taken: 'Username already exists',
  };

  passwordErrors = {
    invalid: 'Password must be between 10 and 72 characters long',
    missing: 'Password is required',
    mismatch: 'Passwords do not match',
  };
  @tracked selectedType = '';
  get isEmailRequired() {
    return this.selectedType !== 'Student';
  }

  get isEmailValid() {
    let email = this.email;

    if (!this.isEmailDirty && email) {
      this.isEmailDirty = true;
    }
    return this.validateEmail(email);
  }

  get isEmailInvalid() {
    return this.isEmailDirty && !this.isEmailValid;
  }

  get doEmailsMatch() {
    return this.email === this.confirmEmail;
  }

  @tracked password = '';

  get isPasswordValid() {
    if (!this.isPasswordDirty && this.password) {
      this.isPasswordDirty = true;
    }
    //TODO: stricter password req
    if (!this.password) {
      return false;
    }
    let length = this.password.length;
    let min = this.passwordMinLength;
    let max = this.passwordMaxLength;

    return length >= min && length <= max;
  }
  @tracked isPasswordDirty = false;
  get isPasswordInvalid() {
    return this.isPasswordDirty && !this.isPasswordValid;
  }
  @tracked confirmPassword = '';
  get doPasswordsMatch() {
    return this.password === this.confirmPassword;
  }

  validateEmail(email) {
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(this.emailRegEx);
    return emailPattern.test(email);
  }

  @action usernameValidate(username) {
    console.log('usernamevalidate component');
    console.log(username);
    if (username) {
      var usernamePattern = new RegExp(this.usernameRegEx);
      var usernameTest = usernamePattern.test(username);

      if (usernameTest === false) {
        this.usernameError = this.usernameErrors.invalid;
        return;
      }

      if (usernameTest === true) {
        // this.set('incorrectUsername', false);
        this.usernameError = null;
        this.missingCredentials = false;
        this.username = username;
        return;
      }
    }
  }

  @action emailValidate(email) {
    console.log('emailValidate component');
    let isValid = this.validateEmail(email);
    if (isValid) {
      this.emailError = null;
      this.email = email;
    } else {
      this.emailError = this.emailErrors.invalid;
    }
  }
  @action passwordValidate(password) {
    console.log('passwordValidate component');
    console.log(password);
    function hasWhiteSpace(string) {
      return /\s/g.test(string);
    }

    if (
      password.length < this.passwordMinLength ||
      password.length > this.passwordMaxLength
    ) {
      this.passwordError = this.passwordErrors.invalid;
    } else {
      this.passwordError = null;

      this.password = password;
    }

    if (hasWhiteSpace(password)) {
      this.noSpacesError = true;
    } else {
      this.noSpacesError = false;
      this.password = password;
    }
  }
  @action resetErrors() {
    console.log('reset errors component');
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
      if (this[error]) {
        this[error] = false;
      }
    }
  }
}
