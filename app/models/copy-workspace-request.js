import { attr, belongsTo } from '@ember-data/model';
import Auditable from './auditable';

export default class CopyWorkspaceRequestModel extends Auditable {
  @attr batchClone;
  @attr('string') name;
  @belongsTo('user', { inverse: null, async: true }) owner;
  @attr('string') mode;
  @belongsTo('workspace', { inverse: null, async: true }) originalWsId;
  @attr submissionOptions;
  @attr folderOptions;
  @attr selectionOptions;
  @attr commentOptions;
  @attr responseOptions;
  @attr permissionOptions;
  @attr('string') copyWorkspaceError;
  @belongsTo('workspace', { async: true }) createdWorkspace;
  @belongsTo('folder-set', { async: true }) createdFolderSet;
}
