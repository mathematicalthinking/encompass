import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  firstName: attr('string'),
  lastName: attr('string'),
  userId: alias('id'),
  email: attr('string'),
  avatar: attr('string'),
  organization: belongsTo('organization'),
  organizationRequest: attr('string'),
  location: attr('string'),
  username: attr('string'),
  googleId: attr('string'),
  requestReason: attr('string'),
  isGuest: attr('boolean'),
  accountType: attr('string'),
  isEmailConfirmed: attr('boolean'),
  isAuthorized: attr('boolean', { defaultValue: false }),
  authorizedBy: belongsTo('user', { inverse: null }),
  seenTour: attr('date'),
  lastImported: attr('date'),
  lastLogin: attr('date'),
  history: attr(),
  sections: attr(),
  assignments: hasMany('assignment', { async: true, inverse: null }),
  answers: hasMany('answer', { async: true }),
  actingRole: attr('string'),
  notifications: hasMany('notifications', { inverse: 'recipient' }),

  actingRoleName: computed('actingRole', function () {
    let actingRole = this.actingRole;
    if (this.accountType === 'P') {
      actingRole === 'teacher'
        ? (actingRole = 'pdadmin')
        : (actingRole = 'student');
    } else if (this.accountType === 'A') {
      actingRole === 'teacher'
        ? (actingRole = 'admin')
        : (actingRole = 'student');
    }
    return actingRole;
  }),
  isAdmin: computed('accountType', function () {
    return this.accountType === 'A';
  }),
  isTeacher: computed('accountType', function () {
    return this.accountType === 'T';
  }),
  isStudent: computed('accountType', 'actingRole', function () {
    return this.accountType === 'S' || this.actingRole === 'student';
  }),
  isPdAdmin: computed('accountType', function () {
    return this.accountType === 'P';
  }),
  isAuthenticated: computed('isGuest', function () {
    return !this.isGuest;
  }),
  isAuthz: computed('isAdmin', 'isAuthorized', function () {
    return this.isAdmin || this.isAuthorized;
  }),
  displayName: computed('name', 'username', 'isLoaded', function () {
    var display = this.name;
    if (!display) {
      display = this.username;
    }
    return display;
  }),
  lastSeen: attr('date'),
  needAdditionalInfo: computed(
    'googleId',
    'requestReason',
    'isAuthz',
    function () {
      const authorized = this.isAuthz;
      if (authorized) {
        return false;
      }

      const googleId = this.googleId;

      if (!googleId) {
        return false;
      }
      const requestReason = this.requestReason;

      if (!requestReason) {
        return true;
      }
      return false;
    }
  ),

  shouldSendAuthEmail: attr('boolean'),
  collabWorkspaces: attr(),
  hiddenWorkspaces: attr(),
  socketId: attr('string'),
  ssoId: attr('string'),
  doForcePasswordChange: attr('boolean', { defaultValue: false }),
  confirmEmailDate: attr('date'),
  isConfirmingEmail: attr('boolean', { defaultValue: false }),
});
