Encompass.CurrentUserMixin = Ember.Mixin.create({
  application: Ember.inject.controller(),
  //needs: 'application',
  currentUser: Ember.computed.alias('application.currentUser'),
});
