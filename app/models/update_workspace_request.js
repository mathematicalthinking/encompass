import Model, { belongsTo, attr, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class UpdateWorkspaceRequest extends Model.extend(Auditable) {
  @belongsTo('workspace', { inverse: null }) workspace;
  @belongsTo('assignment', { inverse: null }) linkedAssignment;
  @attr updateErrors;
  @hasMany('submission', { inverse: null }) addedSubmissions;
  @attr('boolean', { defaultValue: false }) wereNoAnswersToUpdate;
  @attr('boolean', { defaultValue: false }) isParentUpdate;
  @attr createdParentData;
  @attr('boolean', { defaultValue: false }) wasNoDataToUpdate;
  @attr updatedParentData;
}
