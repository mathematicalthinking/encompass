import Service, { inject as service } from '@ember/service';
export default class EditPermissionsService extends Service {
  @service('utility-methods') utils;
  @service currentUser;

  get user() {
    return this.currentUser.user;
  }

  get userId() {
    return this.user.id;
  }

  get userOrg() {
    return this.user.organization;
  }

  get accountType() {
    return this.user.accountType;
  }

  get actingRole() {
    return this.user.actingRole;
  }

  get isAdmin() {
    return this.accountType === 'A';
  }

  get isPdAdmin() {
    return this.accountType === 'P';
  }

  get isTeacher() {
    return this.accountType === 'T';
  }

  get isStudent() {
    return this.accountType === 'S';
  }

  get isPseudoStudent() {
    return this.actingRole === 'S';
  }

  get userOrgId() {
    return this.utils.getBelongsToId(this.user, 'organization');
  }

  get isActingAdmin() {
    return !this.isPseudoStudent && this.isAdmin;
  }

  get isActingPdAdmin() {
    return !this.isPseudoStudent && this.isPdAdmin;
  }

  isCreator(record, user = this.user) {
    if (!user || !record) {
      return;
    }
    return this.utils.getBelongsToId(record, 'createdBy') === this.userId;
  }

  doesRecordBelongToOrg(record, orgId = this.userOrgId) {
    if (!record || !orgId) {
      return;
    }
    return this.utils.getBelongsToId(record, 'organization') === orgId;
  }

  isRecordInPdDomain(record) {
    return this.isActingPdAdmin && this.doesRecordBelongToOrg(record);
  }
}
