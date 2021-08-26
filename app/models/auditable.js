import Model, { belongsTo, attr } from '@ember-data/model';

export default class AuditableModel extends Model {
  @belongsTo('user', { inverse: null }) createdBy;
  @attr('date') createDate;
  @attr('boolean', { defaultValue: false }) isTrashed;
  @belongsTo('user', { inverse: null }) lastModifiedBy;
  @attr('date') lastModifiedDate;
}
