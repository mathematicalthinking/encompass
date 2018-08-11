Encompass.ForgotPasswordComponent = Ember.Component.extend({
  classnames: ['forgot-page'],
  actions: {
    handleRequest: function() {
      const email = this.get('email');
      const forgotPasswordData = {
        email
      };

      return Ember.$.post({
        url: '/auth/forgot',
        data: forgotPasswordData
      })
        .then((res) => {
          console.log('forgotPass response: ', res);
        })
        .catch((err) => {
          this.set(('forgotPasswordErr', err));
        });
    }
  }
});