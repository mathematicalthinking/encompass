import Model, { belongsTo, attr } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  linkedAssignment: belongsTo('assignment', { inverse: null }),
  owner: belongsTo('user', { inverse: null }),
  mode: attr('string'),
  name: attr('string'),
  organization: belongsTo('organization'),
  doAutoUpdateFromChildren: attr('boolean', { defaultValue: true }),
  childWorkspaces: attr({ defaultValue: [] }),
  createdWorkspace: belongsTo('workspace'),
  createWorkspaceError: attr('string'),
});