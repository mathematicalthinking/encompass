import Model, { attr, belongsTo } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class NotificationModel extends Model.extend(Auditable) {
  @attr('string') text;
  @attr('string') primaryRecordType;
  @attr('string') notificationType;
  @belongsTo('submission', { inverse: null }) submission;
  @belongsTo('workspace') workspace;
  @belongsTo('response') response;
  @belongsTo('user') recipient;
  @belongsTo('assignment') assignment;
  @belongsTo('problem') problem;
  @belongsTo('section') section;
  @belongsTo('organization') organziation;
  @attr('boolean', { defaultValue: false }) wasSeen;
}
