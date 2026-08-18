import { attr, belongsTo, hasMany } from '@ember-data/model';
import AuditableModel from './auditable';

export default class UserModel extends AuditableModel {
  @attr('string') firstName;
  @attr('string') lastName;
  @attr('string') email;
  @attr('string') avatar;
  @belongsTo('organization', { async: true }) organization;
  @attr('string') organizationRequest;
  @attr('string') location;
  @attr('string') username;
  @attr('string') googleId;
  @attr('string') requestReason;
  @attr('boolean') isGuest;
  @attr('string') accountType;
  @attr('boolean') isEmailConfirmed;
  @attr('boolean', { defaultValue: false }) isAuthorized;
  @belongsTo('user', { inverse: null, async: true }) authorizedBy;
  @attr('date') seenTour;
  @attr('date') lastImported;
  @attr('date') lastLogin;
  @attr history;
  @attr sections;
  @hasMany('assignment', { async: true, inverse: null }) assignments;
  @hasMany('answer', { async: true }) answers;
  @attr('string') actingRole;
  @hasMany('notifications', { inverse: 'recipient', async: true })
  notifications;
  get actingRoleName() {
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
  }
  get isAdmin() {
    return this.accountType === 'A';
  }
  get isTeacher() {
    return this.accountType === 'T';
  }
  get isStudent() {
    return this.accountType === 'S' || this.actingRole === 'student';
  }
  get isPseudoStudent() {
    return this.actingRole === 'S';
  }

  get isActingAdmin() {
    return !this.isPseudoStudent && this.isAdmin;
  }

  get isActingPdAdmin() {
    return !this.isPseudoStudent && this.isPdAdmin;
  }
  get isPdAdmin() {
    return this.accountType === 'P';
  }
  get isAuthenticated() {
    return !this.isGuest;
  }
  get isAuthz() {
    return this.isAdmin || this.isAuthorized;
  }
  get displayName() {
    return this.name || this.username;
  }
  @attr('date') lastSeen;
  get needAdditionalInfo() {
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
  @attr('boolean') shouldSendAuthEmail;
  @attr collabWorkspaces;
  @attr hiddenWorkspaces;
  @attr('string') socketId;
  @attr('string') ssoId;
  @attr('boolean', { defaultValue: false }) doForcePasswordChange;
  @attr('date') confirmEmailDate;
  @attr('boolean', { defaultValue: false }) isConfirmingEmail;
}
