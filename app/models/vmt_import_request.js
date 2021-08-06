import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';

export default class VmtImportRequest extends Model.extend(Auditable) {
  @attr('string') workspaceName;
  @attr('string') workspaceMode;
  @belongsTo('user', { inverse: null }) workspaceOwner;
  @belongsTo('folder-set', { inverse: null }) folderSet;
  @attr vmtRooms;
  @attr permissionObjects;
  @belongsTo('workspace') createdWorkspace;
  @hasMany('answer', { inverse: null }) createdAnswers;
  @hasMany('submission', { inverse: null }) createdSubmissions;
  @attr('string') createWorkspaceError;
  @attr('boolean') doCreateWorkspace;
}
