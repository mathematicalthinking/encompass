// found in sign-up.js, user-new-admin.js, user-new-pd.js, user-new-teacher.js
Encompass.UserSignupMixin = Ember.Mixin.create({
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
    invalid: 'Username must be all lowercase, at least 3 characters and can only contain the following special characters _',
    missing: 'Username is required',
    taken: 'Username already exists',
  },

  passwordErrors: {
    invalid: 'Password must be between 10 and 72 characters long',
    missing: 'Password is required',
    mismatch: 'Passwords do not match',
  },
//user-new-admin.hbs, user-new-pd.hbs
  isEmailRequired: function() {
    return this.get('selectedType') !== 'Student';
  }.property('selectedType'),
//sign-up.hbs
  isEmailValid: function() {
    let email = this.get('email');

    if (!this.get('isEmailDirty') && !Ember.isEmpty(email)) {
      this.set('isEmailDirty', true);
    }
    return this.validateEmail(email);
  }.property('email', 'isEmailDirty'),

  // We don't want error being displayed when form loads initially
  //forgot-password.hbs, sign-up.hbs
  isEmailInvalid: Ember.computed('isEmailValid', 'isEmailDirty', function() {
    return this.get('isEmailDirty') && !this.get('isEmailValid');
  }),
//sign-up.js, sign-up.hbs
  doEmailsMatch: function() {
    return this.get('email') === this.get('confirmEmail');
  }.property('email', 'confirmEmail'),
//sign-up.hbs
  isPasswordValid: function() {
    if (!this.get('isPasswordDirty') && !Ember.isEmpty(this.get('password'))) {
      this.set('isPasswordDirty', true);
    }
    //TODO: stricter password req
    if (Ember.isEmpty(this.get('password'))) {
      return false;
    }
    let length = this.get('password').length;
    let min = this.get('passwordMinLength');
    let max = this.get('passwordMaxLength');

    return length >= min &&  length <= max;
  }.property('password', 'isPasswordValid', 'passwordMinLength', 'passwordMaxLength'),
//sign-up.hbs
  isPasswordInvalid: Ember.computed('isPasswordValid', 'isPasswordDirty', function() {
    return this.get('isPasswordDirty') && !this.get('isPasswordValid');
  }),
//sign-up.js / hbs
  doPasswordsMatch: function() {
    return this.get('password') === this.get('confirmPassword');
  }.property('password', 'confirmPassword'),
//used below
  validateEmail: function(email) {
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(this.get('emailRegEx'));
    return emailPattern.test(email);
  },

  actions: {
    usernameValidate(username) {
      if (username) {
        var usernamePattern = new RegExp(this.get('usernameRegEx'));
        var usernameTest = usernamePattern.test(username);

        if (usernameTest === false) {
          this.set('usernameError', this.get('usernameErrors.invalid'));
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
        this.set('emailError', this.get('emailErrors.invalid'));
      }
    },
    passwordValidate: function (password) {
      function hasWhiteSpace(string) {
        return /\s/g.test(string);
      }

      if (password.length < this.get('passwordMinLength') || password.length > this.get('passwordMaxLength')) {
        this.set('passwordError', this.get('passwordErrors.invalid'));
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
      const errors = ['missingCredentials', 'noTermsAndConditions', 'usernameError', 'emailError', 'passwordError', 'errorMessage', 'emailExistsError', 'postErrors'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  }
});