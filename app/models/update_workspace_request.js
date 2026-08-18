import { belongsTo, attr, hasMany } from '@ember-data/model';
import Auditable from './auditable';
export default class UpdateWorkspaceRequest extends Auditable {
  @belongsTo('workspace', { inverse: null, async: true }) workspace;
  @belongsTo('assignment', { inverse: null, async: true }) linkedAssignment;
  @attr updateErrors;
  @hasMany('submission', { inverse: null, async: true }) addedSubmissions;
  @attr('boolean', { defaultValue: false }) wereNoAnswersToUpdate;
  @attr('boolean', { defaultValue: false }) isParentUpdate;
  @attr createdParentData;
  @attr('boolean', { defaultValue: false }) wasNoDataToUpdate;
  @attr updatedParentData;
}
