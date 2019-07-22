Encompass.User = DS.Model.extend(Encompass.Auditable, {
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  userId: Ember.computed.alias('id'),
  email: DS.attr('string'),
  avatar: DS.attr('string'),
  organization: DS.belongsTo('organization'),
  organizationRequest: DS.attr('string'),
  location: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  googleId: DS.attr('string'),
  requestReason: DS.attr('string'),
  isGuest: DS.attr('boolean'),
  accountType: DS.attr('string'),
  isEmailConfirmed: DS.attr('boolean'),
  isAuthorized: DS.attr('boolean', {defaultValue: false}),
  authorizedBy: DS.belongsTo('user', { inverse: null }),
  seenTour: DS.attr('date'),
  lastImported: DS.attr('date'),
  lastLogin: DS.attr('date'),
  key: DS.attr('string'),
  history: DS.attr(),
  sections: DS.attr(),
  assignments: DS.hasMany('assignment', {async: true, inverse: null}),
  answers: DS.hasMany('answer', {async: true}),
  actingRole: DS.attr('string'),
  notifications: DS.hasMany('notifications', {inverse: 'recipient'}),

  actingRoleName: function() {
    let actingRole = this.get('actingRole');
    if (this.get('accountType') === "P") {
      (actingRole === 'teacher') ? actingRole = 'pdadmin' : actingRole = 'student';
    } else if (this.get('accountType') === "A") {
      (actingRole === 'teacher') ? actingRole = 'admin': actingRole = 'student';
    }
    return actingRole;
  }.property('actingRole'),
  isAdmin: function () {
    return this.get('accountType') === 'A';
  }.property('accountType'),
  isTeacher: function () {
    return this.get('accountType') === 'T';
  }.property('accountType'),
  isStudent: function () {
    return this.get('accountType') === 'S' || this.get('actingRole') === 'student';
  }.property('accountType', 'actingRole'),
  isPdAdmin: function () {
    return this.get('accountType') === 'P';
  }.property('accountType'),
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
  lastSeen: DS.attr('date'),
  needAdditionalInfo: function() {
    const authorized = this.get('isAuthz');
    if (authorized) {
      return false;
    }

    const googleId = this.get('googleId');

    if (!googleId) {
      return false;
    }
    const requestReason = this.get('requestReason');

    if (!requestReason) {
      return true;
    }
    return false;
  }.property('googleId', 'requestReason', 'isAuthz'),

  shouldSendAuthEmail: DS.attr('boolean'),
  collabWorkspaces: DS.attr(),
  hiddenWorkspaces: DS.attr(),
  socketId: DS.attr('string'),
  ssoId: DS.attr('string')
});