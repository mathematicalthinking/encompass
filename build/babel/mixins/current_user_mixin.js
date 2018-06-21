'use strict';

Encompass.CurrentUserMixin = Ember.Mixin.create({
  application: Ember.inject.controller(),
  //needs: 'application',
  currentUser: Ember.computed.alias('application.currentUser')
});
//# sourceMappingURL=current_user_mixin.js.map
