Encompass.UnconfirmedEmailComponent = Ember.Component.extend({
  classNames: ['unconfirmed-page'],
  didReceiveAttrs: function() {

  },


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
            this.set('emailError', err);
          });
      }
  }
});