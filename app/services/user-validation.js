import Service from '@ember/service';

export default class UserValidationService extends Service {
  emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  usernameRegEx = /^[a-z0-9_]{3,30}$/;
  passwordMinLength = 10;
  passwordMaxLength = 72;

  emailErrors = {
    invalid: 'Invalid email address.',
    missing: 'Email is required',
    mismatch: 'Emails do not match.',
    taken: 'Email address has already been used',
  };

  usernameErrors = {
    invalid:
      'Username must be all lowercase, at least 3 characters, and can only contain letters, numbers, and underscores',
    missing: 'Username is required',
    taken: 'Username already exists',
  };

  passwordErrors = {
    invalid:
      'Password must be between 10 and 72 characters long and cannot contain space',
    missing: 'Password is required',
    mismatch: 'Passwords do not match',
  };

  nameErrors = {
    invalid: 'Name must be between 2 and 128 characters',
    missing: 'Name is required',
  };

  validateEmail(email) {
    if (!email) return { isValid: false, error: this.emailErrors.missing };
    const isValid = this.emailRegEx.test(email.trim());
    return { isValid, error: isValid ? null : this.emailErrors.invalid };
  }

  validateUsername(username) {
    if (!username)
      return { isValid: false, error: this.usernameErrors.missing };
    const isValid = this.usernameRegEx.test(username);
    return { isValid, error: isValid ? null : this.usernameErrors.invalid };
  }

  validateName(name, fieldName = 'Name') {
    if (!name) return { isValid: false, error: `${fieldName} is required` };
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
    if (!password)
      return { isValid: false, error: this.passwordErrors.missing };

    const length = password.length;
    const hasValidLength =
      length >= this.passwordMinLength && length <= this.passwordMaxLength;
    const hasWhiteSpace = /\s/g.test(password);

    // Single error message for any password format issue
    if (!hasValidLength || hasWhiteSpace) {
      return { isValid: false, error: this.passwordErrors.invalid };
    }
    return { isValid: true, error: null };
  }

  validateConfirmPassword(password, confirmPassword) {
    if (!confirmPassword)
      return { isValid: false, error: 'Please confirm your password' };
    if (password !== confirmPassword)
      return { isValid: false, error: this.passwordErrors.mismatch };
    return { isValid: true, error: null };
  }

  validateConfirmEmail(email, confirmEmail) {
    if (!confirmEmail)
      return { isValid: false, error: 'Please confirm your email' };
    if (email !== confirmEmail)
      return { isValid: false, error: this.emailErrors.mismatch };
    return { isValid: true, error: null };
  }
}
