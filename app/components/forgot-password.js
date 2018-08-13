Encompass.ForgotPasswordComponent = Ember.Component.extend({
  classNames: ['forgot-page'],

  validateEmail: function() {
    var email = this.get('email');
    if (!email) {
      return false;
    }
    var emailPattern = new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/);
    var emailTest = emailPattern.test(email);
    console.log(emailTest);

    if (emailTest === false) {
      console.log('false email');
      return false;
    }

    if (emailTest === true) {
      console.log('true email');
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
    const fields = ['email'];
    for (let field of fields) {
      this.set(field, null);
    }
  },

  actions: {
    handleRequest: function() {
      const email = this.get('email');
      const that = this;
      const forgotPasswordData = {
        email
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
          this.set(('forgotPasswordErr', err));
        });
    },
    resetErrors: function() {
      const errors = ['forgotPasswordErr', 'missingRequiredFields'];

      for (let error of errors) {
        if (this.get(error)) {
          this.set(error, false);
        }
      }
    },
  }
});