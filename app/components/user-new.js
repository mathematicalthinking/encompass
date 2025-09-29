import Component from '@glimmer/component';
import { service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { debounce } from '@ember/runloop';

export default class UserNewComponent extends Component {
  @service router;
  @service store;
  @service('sweet-alert') alert;
  @service currentUser;
  @service errorHandling;
  @service userValidation;
  @tracked username = '';
  @tracked password = '';
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked email = '';
  @tracked org = null;
  @tracked location = '';
  @tracked isAuthorized = null;
  @tracked selectedType = null;
  @tracked isCreatingUser = false;
  @tracked showPasswords = false;
  @tracked confirmPassword = '';

  // Configuration object (composition data)
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
  };

  get accountTypes() {
    return this.currentUser.isAdmin
      ? ['Teacher', 'Student', 'Pd Admin', 'Admin']
      : ['Teacher', 'Student'];
  }

  get isStudent() {
    // Defaults to student if no type selected
    return (
      !this.selectedType || this.selectedType.charAt(0).toUpperCase() === 'S'
    );
  }

  get createOrgErrors() {
    return this.errorHandling.getErrors('createOrgErrors');
  }

  get createUserErrors() {
    return this.errorHandling.getErrors('createUserErrors');
  }

  // Adapter method: its in the service, but using this way for cleanliness
  getError(errorKey) {
    return this.errorHandling.getErrors(errorKey)?.[0];
  }

  get usernameError() {
    return this.getError('usernameError');
  }
  get passwordError() {
    return this.getError('passwordError');
  }
  get confirmPasswordError() {
    return this.getError('confirmPasswordError');
  }
  get firstNameError() {
    return this.getError('firstNameError');
  }
  get lastNameError() {
    return this.getError('lastNameError');
  }
  get errorMessage() {
    return this.getError('generalError');
  }
  get emailError() {
    return this.getError('emailError');
  }

  async createNewUser(data) {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error);
    }

    return response.json();
  }

  async handleOrg(org) {
    if (!org) throw new Error('Invalid Data');

    if (typeof org === 'string') {
      const matchingOrg = this.args.organizations.findBy('name', org);
      if (matchingOrg) {
        this.org = matchingOrg;
        return matchingOrg.id;
      }

      const rec = this.store.createRecord('organization', {
        name: org,
        createdBy: this.currentUser.user,
      });

      try {
        const newOrg = await rec.save();
        return newOrg.id;
      } catch (err) {
        this.errorHandling.handleErrors(err, 'createOrgErrors', rec);
        throw err;
      }
    }

    return org.id;
  }

  @action
  confirmOrg() {
    // Clear previous errors
    this.errorHandling.removeMessages(
      'usernameError',
      'emailError',
      'passwordError',
      'generalError'
    );

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isCreatingUser = true;

    if (typeof this.org === 'string') {
      const matchingOrg = this.args.organizations.find(
        (org) => org.name === this.org
      );
      if (matchingOrg) {
        this.newUser();
      } else {
        this.alert
          .showModal(
            'question',
            `Are you sure you want to create ${this.org}`,
            null,
            'Yes'
          )
          .then((result) => {
            if (result.value) {
              this.newUser();
            } else {
              this.isCreatingUser = false;
            }
          });
      }
    } else {
      this.newUser();
    }
  }

  async newUser() {
    // Default to 'S' (Student) if no type selected
    const accountTypeLetter = this.selectedType?.charAt(0).toUpperCase() || 'S';

    if (!this.username || !this.password) {
      this.errorHandling.handleErrors(
        { errors: [{ detail: 'Missing required fields' }] },
        'generalError'
      );
      this.isCreatingUser = false;
      return;
    }

    // For non-students: all other fields required
    if (
      accountTypeLetter !== 'S' &&
      (!this.firstName || !this.lastName || !this.email || !this.location)
    ) {
      this.errorHandling.handleErrors(
        { errors: [{ detail: 'Missing required fields' }] },
        'generalError'
      );
      this.isCreatingUser = false;
      return;
    }

    const userData = {
      username: this.username,
      password: this.password,
      accountType: accountTypeLetter,
      isAuthorized: false, // Always defaults to false
      createdBy: this.currentUser.id,
    };

    // Only add non-student fields if not a student
    if (accountTypeLetter !== 'S') {
      userData.firstName = this.firstName;
      userData.lastName = this.lastName;
      userData.email = this.email;
      userData.location = this.location;
      if (this.isAuthorized) {
        userData.isAuthorized = true;
        userData.authorizedBy = this.currentUser.id;
      }
    }

    try {
      let orgId;
      if (accountTypeLetter === 'S') {
        // Students: use selected org or default to creator's org
        orgId = await this.handleOrg(
          this.org || this.currentUser.user.organization
        );
      } else {
        // Non-students: must have org selected
        if (!this.org) {
          this.errorHandling.handleErrors(
            { errors: [{ detail: 'Organization is required' }] },
            'generalError'
          );
          this.isCreatingUser = false;
          return;
        }
        orgId = await this.handleOrg(this.org);
      }

      userData.organization = orgId;
      const res = await this.createNewUser(userData);
      if (res.username) {
        this.alert.showToast(
          'success',
          `${res.username} created`,
          'bottom-end',
          3000,
          null,
          false
        );
        this.router.transitionTo('users.user', res.id);
      } else if (res.message?.includes('username')) {
        this.errorHandling.handleErrors(
          { errors: [{ detail: this.userValidation.usernameErrors.taken }] },
          'usernameError'
        );
      } else if (res.message?.includes('email')) {
        this.errorHandling.handleErrors(
          { errors: [{ detail: this.userValidation.emailErrors.taken }] },
          'emailError'
        );
      } else {
        this.errorHandling.handleErrors(
          { errors: [{ detail: res.message }] },
          'createUserErrors'
        );
      }
    } catch (err) {
      this.errorHandling.handleErrors(err, 'createUserErrors');
    } finally {
      this.isCreatingUser = false;
    }
  }

  // Generic validation method using composition
  validateField(fieldName) {
    const config = this.fieldConfig[fieldName];
    if (!config) return;

    let result;
    if (config.fieldName) {
      // For name validation with custom field name
      result = this.userValidation[config.validator](
        this[fieldName],
        config.fieldName
      );
    } else if (config.args) {
      // For methods that need multiple arguments
      const args = config.args.map((arg) => this[arg]);
      result = this.userValidation[config.validator](...args);
    } else {
      // For simple single-argument methods
      result = this.userValidation[config.validator](this[fieldName]);
    }
    if (!result.isValid) {
      this.errorHandling.handleErrors(
        { errors: [{ detail: result.error }] },
        config.errorKey
      );
    } else {
      this.errorHandling.removeMessages(config.errorKey);
    }
  }

  _validateUsername() {
    this.validateField('username');
  }

  _validatePassword() {
    this.validateField('password');
  }

  _validateConfirmPassword() {
    this.validateField('confirmPassword');
  }

  _validateEmail() {
    this.validateField('email');
  }

  _validateFirstName() {
    this.validateField('firstName');
  }

  _validateLastName() {
    this.validateField('lastName');
  }

  @action
  usernameValidate() {
    debounce(this, this._validateUsername, 150);
  }

  @action
  passwordValidate() {
    debounce(this, this._validatePassword, 150);
  }

  @action
  confirmPasswordValidate() {
    debounce(this, this._validateConfirmPassword, 150);
  }

  @action
  emailValidate() {
    if (this.email || !this.isStudent) {
      debounce(this, this._validateEmail, 150);
    } else {
      this.errorHandling.removeMessages('emailError');
    }
  }

  @action
  firstNameValidate() {
    if (this.firstName || !this.isStudent) {
      debounce(this, this._validateFirstName, 150);
    } else {
      this.errorHandling.removeMessages('firstNameError');
    }
  }

  @action
  lastNameValidate() {
    if (this.lastName || !this.isStudent) {
      debounce(this, this._validateLastName, 150);
    } else {
      this.errorHandling.removeMessages('lastNameError');
    }
  }

  validateForm() {
    let isValid = true;
    let missingFields = [];
    const requiredFields = ['username', 'password', 'confirmPassword'];
    if (!this.isStudent) {
      requiredFields.push('firstName', 'lastName', 'email', 'location');
    }

    requiredFields.forEach((field) => {
      if (!this[field]) {
        missingFields.push(
          field
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, (str) => str.toUpperCase())
        );
      } else if (this.fieldConfig[field]) {
        this.validateField(field);
        if (this.getError(this.fieldConfig[field].errorKey)) {
          isValid = false;
        }
      }
    });

    if (!this.isStudent && !this.org) missingFields.push('Organization');

    if (missingFields.length > 0) {
      const message = `Missing required fields: ${missingFields.join(', ')}`;
      this.errorHandling.handleErrors(
        { errors: [{ detail: message }] },
        'generalError'
      );
      isValid = false;
    }

    return isValid;
  }

  @action
  cancelNew() {
    this.router.transitionTo('users');
  }

  @action
  setOrg(org) {
    this.org = org;
  }

  @action
  setAccountType(type) {
    this.selectedType = type;
    // Clear email error when switching to student
    if (type === 'Student') {
      this.errorHandling.removeMessages('emailError');
    }
  }

  @action
  resetError(errorType) {
    this.errorHandling.removeMessages(errorType);
  }

  @action
  removeErrorFromArray(type, error) {
    this.errorHandling.removeErrorFromArray(type, error);
  }

  @action
  resetErrors() {
    this.errorHandling.removeMessages(
      'usernameError',
      'emailError',
      'passwordError',
      'confirmPasswordError',
      'firstNameError',
      'lastNameError'
    );
  }

  @action
  togglePasswordVisibility() {
    this.showPasswords = !this.showPasswords;
  }
}
