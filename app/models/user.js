Encompass.User = DS.Model.extend(Encompass.Auditable, {
  name: DS.attr('string'),
  userId: Ember.computed.alias('id'),
  email: DS.attr('string'),
  organization: DS.belongsTo('organization'),
  location: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  requestReason: DS.attr('string'),
  isGuest: DS.attr('boolean'),
  isAdmin: DS.attr('boolean'),
  isAuthorized: DS.attr('boolean'),
  isStudent: DS.attr('boolean'),
  seenTour: DS.attr('date'),
  lastImported: DS.attr('date'),
  lastLogin: DS.attr('date'),
  key: DS.attr('string'),
  history: DS.attr(),
  isAuthenticated: function() {
    return !this.get('isGuest');
  }.property('isGuest'),
  isAuthz: function(){
    return (this.get('isAdmin') || this.get('isAuthorized'));
  }.property('isAdmin', 'isAuthorized'),
  displayName: function(){
    var display = this.get('name');
    if(!display) {
      display = this.get('username');
    }
    return display;
  }.property('name', 'username', 'isLoaded'),
  lastSeen: DS.attr('date')
});