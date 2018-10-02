Encompass.ForgotPasswordComponent = Ember.Component.extend(Encompass.ErrorHandlingMixin, {
  classNames: ['forgot-page'],
  postErrors: [],

  validateEmail: function() {
    var email = this.get('email');
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    var emailTest = emailPattern.test(email);

    if (emailTest === false) {
      return false;
    }

    if (emailTest === true) {
      return true;
    }

  },
  isEmailValid: function() {
    if (!this.get('isEmailDirty') && !Ember.isEmpty(this.get('email'))) {
      this.set('isEmailDirty', true);
    }
    return this.validateEmail();
  }.property('email'),

  // We don't want error being displayed when form loads initially
  isEmailInvalid: Ember.computed('isEmailValid', 'isEmailDirty', function() {
    return this.get('isEmailDirty') && !this.get('isEmailValid') && !Ember.isEmpty(this.get('email'));
  }),

  clearFields: function() {
    const fields = ['email', 'username'];
    for (let field of fields) {
      this.set(field, null);
    }
  },

  actions: {
    handleRequest: function() {
      const email = this.get('email');
      const username = this.get('username');

      if (!email && !username) {
        this.set('missingRequiredFields', true);
        return;
      }

      if (email && username) {
        this.set('tooMuchData', true);
        return;
      }

      const that = this;
      const forgotPasswordData = {
        email,
        username
      };

      return Ember.$.post({
        url: '/auth/forgot',
        data: forgotPasswordData
      })
        .then((res) => {
          if (res.isSuccess) {
            that.clearFields();
            that.set('resetEmailSent', true);
          } else {
            that.set('forgotPasswordErr', res.info);
          }
        })
        .catch((err) => {
          this.handleErrors(err, 'postErrors');
        });
    },
    resetMessages: function() {
      const messages = ['forgotPasswordErr', 'missingRequiredFields', 'tooMuchData', 'resetEmailSent'];

      for (let message of messages) {
        if (this.get(message)) {
          this.set(message, false);
        }
      }
    },
  }
});