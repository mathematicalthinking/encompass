import Model, { belongsTo, attr, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  teacher: belongsTo('user', { inverse: null }),
  assignment: belongsTo('assignment', { inverse: null }),
  problem: belongsTo('problem', { inverse: null }),
  section: belongsTo('section', { inverse: null }),
  startDate: attr('date'),
  endDate: attr('date'),
  pdSetName: attr('string'),
  folderSet: belongsTo('folderSet', { inverse: null }),
  requestedName: attr('string'),
  createdWorkspace: belongsTo('workspace'),
  isEmptyAnswerSet: attr('boolean', { defaultValue: null }),
  createWorkspaceError: attr('string'),
  owner: belongsTo('user', { inverse: null }),
  mode: attr('string'),
  answers: hasMany('answer', { inverse: null }),
  newAnswerSet: attr(),
  permissionObjects: attr(),
});
