Encompass.UnAuthorizedComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.MtAuthMixin, {
  elementId: 'un-authorized',

  contactEmail: function() {
    return this.getContactEmail();
  }.property(),
});