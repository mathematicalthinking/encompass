import { attr, belongsTo } from '@ember-data/model';
import Auditable from './auditable';
export default class NotificationModel extends Auditable {
  @attr('string') text;
  @attr('string') primaryRecordType;
  @attr('string') notificationType;
  @belongsTo('submission', { inverse: null, async: true }) submission;
  @belongsTo('workspace', { async: true }) workspace;
  @belongsTo('response', { async: true }) response;
  @belongsTo('user', { async: true }) recipient;
  @belongsTo('assignment', { async: true }) assignment;
  @belongsTo('problem', { async: true }) problem;
  @belongsTo('section', { async: true }) section;
  @belongsTo('organization', { async: true }) organization;
  @attr('boolean', { defaultValue: false }) wasSeen;
}
