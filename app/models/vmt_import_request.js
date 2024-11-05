import { attr, belongsTo, hasMany } from '@ember-data/model';
import AuditableModel from './auditable';
export default class VmtImportRequest extends AuditableModel {
  @attr('string') workspaceName;
  @attr('string') workspaceMode;
  @belongsTo('user', { inverse: null, async: true }) workspaceOwner;
  @belongsTo('folder-set', { inverse: null, async: true }) folderSet;
  @attr vmtRooms;
  @attr permissionObjects;
  @belongsTo('workspace') createdWorkspace;
  @hasMany('answer', { inverse: null, async: true }) createdAnswers;
  @hasMany('submission', { inverse: null, async: true }) createdSubmissions;
  @attr('string') createWorkspaceError;
  @attr('boolean') doCreateWorkspace;
}
