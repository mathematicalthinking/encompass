import Service from '@ember/service';
import { inject as service } from '@ember/service';

export default class UserValidationService extends Service {
  @service errorHandling;

  emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  usernameRegEx = /^[a-z0-9_]{3,30}$/;
  passwordMinLength = 10;
  passwordMaxLength = 72;

  fieldConfig = {
    username: { validator: 'validateUsername', errorKey: 'usernameError' },
    password: { validator: 'validatePassword', errorKey: 'passwordError' },
    email: { validator: 'validateEmail', errorKey: 'emailError' },
    confirmPassword: {
      validator: 'validateConfirmPassword',
      errorKey: 'confirmPasswordError',
      args: ['password', 'confirmPassword'],
    },
    firstName: {
      validator: 'validateName',
      errorKey: 'firstNameError',
      fieldName: 'First name',
    },
    lastName: {
      validator: 'validateName',
      errorKey: 'lastNameError',
      fieldName: 'Last name',
    },
    location: { validator: 'validateLocation', errorKey: 'locationError' },
    organization: {
      validator: 'validateOrganization',
      errorKey: 'organizationError',
    },
  };

  validateEmail(email) {
    if (!email) return { isValid: true, error: null };
    const isValid = this.emailRegEx.test(email.trim());
    return { isValid, error: isValid ? null : 'Invalid email address' };
  }

  validateUsername(username) {
    if (!username) return { isValid: true, error: null };
    const isValid = this.usernameRegEx.test(username);
    return {
      isValid,
      error: isValid
        ? null
        : 'Username must be 3+ characters,lowercase letters/numbers/underscores only',
    };
  }

  validateName(name, fieldName = 'Name') {
    if (!name) return { isValid: true, error: null };
    const trimmed = name.trim();
    if (trimmed.length < 2 || trimmed.length > 128) {
      return {
        isValid: false,
        error: `${fieldName} must be between 2 and 128 characters`,
      };
    }
    return { isValid: true, error: null };
  }

  validatePassword(password) {
    if (!password) return { isValid: true, error: null };
    const length = password.length;
    const hasValidLength = length >= this.passwordMinLength && length <= this.passwordMaxLength;
    const hasWhiteSpace = /\s/g.test(password);

    if (!hasValidLength || hasWhiteSpace) {
      return {
        isValid: false,
        error:
          'Password must be between 10 and 72 characters & cannot contain space',
      };
    }
    return { isValid: true, error: null };
  }

  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword) return { isValid: true, error: null };
    if (password !== confirmPassword) {
      return { isValid: false, error: 'Passwords do not match' };
    }
    return { isValid: true, error: null };
  }

  validateLocation(location) {
    if (!location) return { isValid: true, error: null };
    const trimmed = location.trim();
    if (trimmed.length < 2 || trimmed.length > 128) {
      return {
        isValid: false,
        error: 'Location must be between 2 and 128 characters',
      };
    }
    return { isValid: true, error: null };
  }

  validateOrganization(organization) {
    if (!organization) return { isValid: true, error: null };
    const orgName = typeof organization === 'string' ? organization : organization.name;
    if (!orgName) return { isValid: true, error: null };

    const trimmed = orgName.trim();
    if (trimmed.length < 2 || trimmed.length > 128) {
      return {
        isValid: false,
        error: 'Organization must be between 2 and 128 characters',
      };
    }
    return { isValid: true, error: null };
  }

  validate(fieldName, value, ...extraArgs) {
    const config = this.fieldConfig[fieldName];
    if (!config) return true;

    let result;
    if (config.fieldName) {
      result = this[config.validator](value, config.fieldName);
    } else if (config.args) {
      result = this[config.validator](...extraArgs);
    } else {
      result = this[config.validator](value);
    }

    if (!result.isValid) {
      this.errorHandling.handleErrors(
        { errors: [{ detail: result.error }] },
        config.errorKey
      );
      return false;
    } else {
      this.errorHandling.removeMessages(config.errorKey);
      return true;
    }
  }

  getError(fieldName) {
    const config = this.fieldConfig[fieldName];
    if (!config) return null;
    return this.errorHandling.getErrors(config.errorKey)?.[0] || null;
  }

  resetError(fieldName) {
    const config = this.fieldConfig[fieldName];
    if (config) {
      this.errorHandling.removeMessages(config.errorKey);
    }
  }

  resetErrors() {
    const errorKeys = Object.values(this.fieldConfig).map(
      (config) => config.errorKey
    );
    this.errorHandling.removeMessages(...errorKeys);
  }

  setServerError(errorType, message) {
    this.errorHandling.handleErrors(
      { errors: [{ detail: message }] },
      errorType
    );
  }

  setGeneralError(message) {
    this.errorHandling.handleErrors(
      { errors: [{ detail: message }] },
      'generalError'
    );
  }

  getArrayErrors(errorType) {
    return this.errorHandling.getErrors(errorType) || [];
  }

  removeArrayError(errorType, error) {
    this.errorHandling.removeErrorFromArray(errorType, error);
  }

  clearFormErrors() {
    const allErrorKeys = [
      ...Object.values(this.fieldConfig).map((config) => config.errorKey),
      'generalError',
    ];
    this.errorHandling.removeMessages(...allErrorKeys);
  }
}
