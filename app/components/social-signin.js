Encompass.SocialSigninComponent = Ember.Component.extend(Encompass.MtAuthMixin, {
  content: null,

  googleUrl: function() {
    return this.getSsoGoogleUrl();
  }.property(),

  actions: {
  }
});