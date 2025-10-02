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
  @service userValidation;
  @tracked username = '';
  @tracked password = '';
  @tracked firstName = '';
  @tracked lastName = '';
  @tracked email = '';
  @tracked org = null;
  @tracked requiredErrors = {};
  @tracked location = '';
  @tracked selectedType = 'Student';
  @tracked isAuthorized = false;
  @tracked isCreatingUser = false;
  @tracked showPasswords = false;
  @tracked confirmPassword = '';

  get accountTypes() {
    return this.currentUser.isAdmin
      ? ['Teacher', 'Student', 'Pd Admin', 'Admin']
      : ['Teacher', 'Student'];
  }

  get isAdminUser() {
    return this.currentUser.isAdmin || this.currentUser.isPdAdmin;
  }

  get isCreatingStudent() {
    return this.selectedType === 'Student';
  }

  get createOrgErrors() {
    return this.userValidation.getArrayErrors('createOrgErrors');
  }

  get createUserErrors() {
    return this.userValidation.getArrayErrors('createUserErrors');
  }

  get generalError() {
    return this.userValidation.getArrayErrors('generalError')?.[0] || null;
  }

  getFieldError(fieldName) {
    return (
      this.requiredErrors[fieldName] || this.userValidation.getError(fieldName)
    );
  }

  get usernameError() {
    return this.getFieldError('username');
  }

  get passwordError() {
    return this.getFieldError('password');
  }

  get confirmPasswordError() {
    return this.getFieldError('confirmPassword');
  }

  get firstNameError() {
    return this.getFieldError('firstName');
  }

  get lastNameError() {
    return this.getFieldError('lastName');
  }

  get emailError() {
    return this.getFieldError('email');
  }

  get locationError() {
    return this.getFieldError('location');
  }

  get organizationError() {
    return this.getFieldError('organization');
  }

  _validateUsername() {
    this.userValidation.validate('username', this.username);
  }

  _validatePassword() {
    this.userValidation.validate('password', this.password);
  }

  _validateConfirmPassword() {
    this.userValidation.validate(
      'confirmPassword',
      null,
      this.password,
      this.confirmPassword
    );
  }

  _validateEmail() {
    this.userValidation.validate('email', this.email);
  }

  _validateFirstName() {
    this.userValidation.validate('firstName', this.firstName);
  }

  _validateLastName() {
    this.userValidation.validate('lastName', this.lastName);
  }

  _validateLocation() {
    this.userValidation.validate('location', this.location);
  }

  _validateOrganization() {
    this.userValidation.validate('organization', this.org);
  }

  validateField(fieldName, value, isRequired, validatorMethod, customMessage) {
    const requiredMessage =
      customMessage ||
      `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;

    if (isRequired && !value?.trim()) {
      this.requiredErrors = {
        ...this.requiredErrors,
        [fieldName]: requiredMessage,
      };
    } else {
      const { [fieldName]: removed, ...rest } = this.requiredErrors;
      this.requiredErrors = rest;
    }
    debounce(this, validatorMethod, 150);
  }

  @action
  usernameValidate() {
    this.validateField('username', this.username, true, this._validateUsername);
  }

  @action
  passwordValidate() {
    this.validateField('password', this.password, true, this._validatePassword);
  }

  @action
  emailValidate() {
    this.validateField(
      'email',
      this.email,
      !this.isCreatingStudent,
      this._validateEmail
    );
  }

  @action
  firstNameValidate() {
    this.validateField(
      'firstName',
      this.firstName,
      !this.isCreatingStudent,
      this._validateFirstName
    );
  }

  @action
  lastNameValidate() {
    this.validateField(
      'lastName',
      this.lastName,
      !this.isCreatingStudent,
      this._validateLastName
    );
  }

  @action
  locationValidate() {
    this.validateField(
      'location',
      this.location,
      !this.isCreatingStudent,
      this._validateLocation
    );
  }

  @action
  confirmPasswordValidate() {
    this.validateField(
      'confirmPassword',
      this.confirmPassword,
      true,
      this._validateConfirmPassword,
      'Please confirm your password'
    );
  }

  // keep as is for organization since it's a special case
  @action
  organizationValidate() {
    if (!this.isCreatingStudent && !this.org) {
      this.requiredErrors = {
        ...this.requiredErrors,
        organization: 'Organization is required',
      };
    } else {
      // eslint-disable-next-line no-unused-vars
      const { organization, ...rest } = this.requiredErrors;
      this.requiredErrors = rest;
      if (this.isCreatingStudent) {
        this.userValidation.resetError('organization');
      }
    }
    if (this.org && this.org !== '') {
      debounce(this, this._validateOrganization, 150);
    }
  }

  // UI actions
  @action
  togglePasswordVisibility() {
    this.showPasswords = !this.showPasswords;
  }

  @action
  setOrg(org) {
    this.org = org;
    this.organizationValidate();
  }

  @action
  setAccountType(type) {
    this.selectedType = type;
  }

  @action
  setAuthorized(event) {
    this.isAuthorized = event.target.value === 'true';
  }

  @action
  cancelNew() {
    this.router.replaceWith('users');
  }

  setRequiredErrors() {
    const errors = {};

    if (!this.username?.trim()) errors.username = 'Username is required';
    if (!this.password?.trim()) errors.password = 'Password is required';
    if (!this.confirmPassword?.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    }

    if (!this.isCreatingStudent) {
      if (!this.firstName?.trim()) errors.firstName = 'First name is required';
      if (!this.lastName?.trim()) errors.lastName = 'Last name is required';
      if (!this.email?.trim()) errors.email = 'Email is required';
      if (!this.location?.trim()) errors.location = 'Location is required';
      if (!this.org) errors.organization = 'Organization is required';
    }

    this.requiredErrors = errors;
  }

  async createNewUser(data) {
    const response = await fetch('/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || JSON.stringify(errorData);
      } catch {
        errorMessage = await response.text();
      }
      throw new Error(errorMessage);
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
        this.userValidation.setServerError(
          'createOrgErrors',
          err.message || 'Failed to create organization'
        );
        throw err;
      }
    }

    return org.id;
  }

  validateForm() {
    const errors = [
      this.usernameError,
      this.passwordError,
      this.confirmPasswordError,
      this.emailError,
      this.firstNameError,
      this.lastNameError,
      this.locationError,
      this.organizationError,
    ];
    return { isValid: !errors.some(Boolean) };
  }

  @action
  async confirmOrg() {
    this.setRequiredErrors();
    const validation = this.validateForm();

    if (!validation.isValid) {
      return;
    }

    this.isCreatingUser = true;

    try {
      if (typeof this.org === 'string') {
        const matchingOrg = this.args.organizations.find(
          (org) => org.name === this.org
        );
        if (matchingOrg) {
          this.org = matchingOrg;
        } else {
          const confirmed = await this.alert.showModal(
            'question',
            `Are you sure you want to create ${this.org}`,
            null,
            'Yes'
          );
          if (confirmed.value) {
            await this.handleOrg(this.org);
          } else {
            this.isCreatingUser = false;
            return;
          }
        }
      }
      this.newUser();
    } catch (err) {
      this.isCreatingUser = false;
    }
  }

  buildUserData() {
    const userData = {
      username: this.username,
      password: this.password,
      accountType: this.selectedType?.charAt(0).toUpperCase() || 'S',
      isAuthorized: this.isAuthorized,
      createdBy: this.currentUser.id,
    };

    if (this.isAuthorized) {
      userData.authorizedBy = this.currentUser.id;
    }

    if (userData.accountType !== 'S') {
      userData.firstName = this.firstName;
      userData.lastName = this.lastName;
      userData.email = this.email;
      userData.location = this.location;
    }

    return userData;
  }

  assignOrganization(userData) {
    if (this.org?.id) {
      userData.organization = this.org.id;
    } else if (this.currentUser.user?.organization?.id) {
      userData.organization = this.currentUser.user.organization.id;
    } else if (this.args.organizations?.[0]?.id) {
      userData.organization = this.args.organizations[0].id;
    } else {
      userData.organizationRequest = 'Default Organization';
    }
  }

  async newUser() {
    const userData = this.buildUserData();
    this.assignOrganization(userData);

    try {
      const res = await this.createNewUser(userData);
      if (res.message) {
        this.userValidation.setServerError('createUserErrors', res.message);
        return;
      }
      if (res.username) {
        this.handleUserCreationSuccess(res);
      }
    } catch (err) {
      this.userValidation.setServerError('createUserErrors', err.message);
    } finally {
      this.isCreatingUser = false;
    }
  }

  handleUserCreationSuccess(res) {
    this.userValidation.clearFormErrors();
    this.alert.showToast(
      'success',
      `${res.username} created`,
      'bottom-end',
      3000,
      null,
      false
    );
    setTimeout(() => {
      this.router.transitionTo('users.user', res.id);
    }, 100);
  }
}
