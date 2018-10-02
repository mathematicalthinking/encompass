Encompass.UnconfirmedEmailComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  elementId: ['unconfirmed-page'],
  emailErrors: [],

  actions: {
    sendEmail: function() {
      const recipient = this.get('currentUser.email');
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