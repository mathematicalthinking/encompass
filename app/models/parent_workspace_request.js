import Model, { belongsTo, attr } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class ParentWorkspaceRequest extends Model.extend(Auditable) {
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
