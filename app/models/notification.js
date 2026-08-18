import { attr, belongsTo } from '@ember-data/model';
import Auditable from './auditable';
export default class NotificationModel extends Auditable {
  @attr('string') text;
  @attr('string') primaryRecordType;
  @attr('string') notificationType;
  @belongsTo('submission', { inverse: null, async: true }) submission;
  @belongsTo('workspace', { inverse: null, async: true }) workspace;
  @belongsTo('response', { inverse: null, async: true }) response;
  @belongsTo('user', { inverse: 'notifications', async: true }) recipient;
  @belongsTo('assignment', { inverse: null, async: true }) assignment;
  @belongsTo('problem', { inverse: null, async: true }) problem;
  @belongsTo('section', { inverse: null, async: true }) section;
  @belongsTo('organization', { inverse: null, async: true }) organization;
  @attr('boolean', { defaultValue: false }) wasSeen;
}
