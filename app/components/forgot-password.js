Encompass.ForgotPasswordComponent = Ember.Component.extend({
  classNames: ['forgot-page'],

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
          that.set('resetEmailSent', true);
        })
        .catch((err) => {
          this.set(('forgotPasswordErr', err));
        });
    }
  }
});