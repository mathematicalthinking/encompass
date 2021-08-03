import Model, { attr, belongsTo } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  text: attr('string'),
  primaryRecordType: attr('string'),
  notificationType: attr('string'),
  submission: belongsTo('submission', { inverse: null }),
  workspace: belongsTo('workspace'),
  response: belongsTo('response'),
  recipient: belongsTo('user'),
  assignment: belongsTo('assignment'),
  problem: belongsTo('problem'),
  section: belongsTo('section'),
  organziation: belongsTo('organization'),
  wasSeen: attr('boolean', { defaultValue: false })
});