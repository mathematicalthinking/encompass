import Model, { belongsTo, attr } from '@ember-data/model';

export default class AuditableModel extends Model {
  @belongsTo('user', { inverse: null, async: true }) createdBy;
  @attr('date') createDate;
  @attr('boolean', { defaultValue: false }) isTrashed;
  @belongsTo('user', { inverse: null, async: true }) lastModifiedBy;
  @attr('date') lastModifiedDate;

  isModelType(type) {
    return this.constructor.modelName === type;
  }
}
