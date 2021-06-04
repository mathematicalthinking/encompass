Encompass.UnconfirmedController = Ember.Controller.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  emailErrors: [],
  actions: {
    sendEmail: function() {
      Ember.$.get('/auth/resend/confirm')
      .then((res) => {
        if (res.isSuccess) {
          this.set('emailSuccess', true);
        }
      })
      .catch((err) => {
        this.handleErrors(err, 'emailErrors');
      });
    }
  }
});