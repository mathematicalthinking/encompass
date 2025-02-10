import Service, { inject as service } from '@ember/service';
export default class EditPermissionsService extends Service {
  @service('utility-methods') utils;
  @service currentUser;

  isCreator(record, user = this.currentUser.user) {
    if (!user || !record) {
      return;
    }
    return (
      this.utils.getBelongsToId(record, 'createdBy') ===
      this.currentUser.user.id
    );
  }

  doesRecordBelongToOrg(
    record,
    orgId = this.utils.getBelongsToId(this.user, 'organization')
  ) {
    if (!record || !orgId) {
      return;
    }
    return this.utils.getBelongsToId(record, 'organization') === orgId;
  }

  isRecordInPdDomain(record) {
    return this.isActingPdAdmin && this.doesRecordBelongToOrg(record);
  }
}
