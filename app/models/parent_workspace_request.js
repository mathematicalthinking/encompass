import { belongsTo, attr } from '@ember-data/model';
import Auditable from './auditable';
export default class ParentWorkspaceRequest extends Auditable {
  @belongsTo('assignment', { inverse: null, async: true }) linkedAssignment;
  @belongsTo('user', { inverse: null, async: true }) owner;
  @attr('string') mode;
  @attr('string') name;
  @belongsTo('organization', { async: true }) organization;
  @attr('boolean', { defaultValue: true }) doAutoUpdateFromChildren;
  @attr({ defaultValue: [] }) childWorkspaces;
  @belongsTo('workspace', { async: true }) createdWorkspace;
  @attr('string') createWorkspaceError;
}
