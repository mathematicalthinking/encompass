import { belongsTo, attr } from '@ember-data/model';
import Auditable from './auditable';
export default class ParentWorkspaceRequest extends Auditable {
  @belongsTo('assignment', { inverse: null }) linkedAssignment;
  @belongsTo('user', { inverse: null }) owner;
  @attr('string') mode;
  @attr('string') name;
  @belongsTo('organization') organization;
  @attr('boolean', { defaultValue: true }) doAutoUpdateFromChildren;
  @attr({ defaultValue: [] }) childWorkspaces;
  @belongsTo('workspace') createdWorkspace;
  @attr('string') createWorkspaceError;
}
