import { attr, belongsTo } from '@ember-data/model';
import Auditable from './_auditable_mixin';

export default class CopyWorkspaceRequestModel extends Auditable {
  @attr('string') name;
  @belongsTo('user', { inverse: null }) owner;
  @attr('string') mode;
  @belongsTo('workspace', { inverse: null }) originalWsId;
  @attr submissionOptions;
  @attr folderOptions;
  @attr selectionOptions;
  @attr commentOptions;
  @attr responseOptions;
  @attr permissionOptions;
  @attr('string') copyWorkspaceError;
  @belongsTo('workspace') createdWorkspace;
  @belongsTo('folder-set') createdFolderSet;
}
