import Model, { belongsTo, attr, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  workspace: belongsTo('workspace', { inverse: null }),
  linkedAssignment: belongsTo('assignment', { inverse: null }),
  updateErrors: attr(),
  addedSubmissions: hasMany('submission', { inverse: null }),
  wereNoAnswersToUpdate: attr('boolean', { defaultValue: false }),
  isParentUpdate: attr('boolean', { defaultValue: false }),
  createdParentData: attr(),
  wasNoDataToUpdate: attr('boolean', { defaultValue: false }),
  updatedParentData: attr(),
});