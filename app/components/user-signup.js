import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class UserSignupComponent extends Component {
  emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  usernameRegEx = /^[a-z0-9_]{3,30}$/;
  passwordMinLength = 10;
  passwordMaxLength = 72;
  @tracked passwordError = null;
  @tracked usernameError = null;
  @tracked emailError = null;
  @tracked email = '';
  @tracked confirmEmail = '';
  @tracked confirmPassword = '';
  @tracked selectedType = '';
  @tracked password = '';
  @tracked username = '';

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
  get isEmailRequired() {
    return this.selectedType !== 'Student';
  }

  get isEmailValid() {
    return this.validateEmail(this.email);
  }

  get isEmailInvalid() {
    return this.email && !this.validateEmail(this.email);
  }

  get doEmailsMatch() {
    return this.email === this.confirmEmail;
  }

  get isPasswordValid() {
    return this.validatePassword(this.password);
  }
  get isPasswordInvalid() {
    return this.password && !this.validatePassword(this.password);
  }
  get doPasswordsMatch() {
    return this.password === this.confirmPassword;
  }

  validateEmail(email) {
    if (!email) return false;
    return this.emailRegEx.test(email.trim());
  }

  validatePassword(password) {
    if (!this.password) {
      return false;
    }
    let length = password.length;
    let min = this.passwordMinLength;
    let max = this.passwordMaxLength;

    return length >= min && length <= max;
  }

  @action usernameValidate() {
    this.resetErrors();
    if (this.username) {
      var usernamePattern = new RegExp(this.usernameRegEx);
      var usernameTest = usernamePattern.test(this.username);

      if (usernameTest === false) {
        this.usernameError = this.usernameErrors.invalid;
        return;
      }

      if (usernameTest === true) {
        // this.set('incorrectUsername', false);
        this.usernameError = null;
        this.missingCredentials = false;
        return;
      }
    }
  }

  @action passwordValidate(password) {
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
  @action emailValidate(event) {
    const email = event.target.value;
    let isValid = this.validateEmail(email);
    if (isValid) {
      this.emailError = null;
      this.email = email;
    } else {
      this.emailError = this.emailErrors.invalid;
    }
  }

  @action resetErrors() {
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
