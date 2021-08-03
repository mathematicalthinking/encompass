import Model, { attr, belongsTo } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  name: attr('string'),
  owner: belongsTo('user', { inverse: null }),
  mode: attr('string'),
  originalWsId: belongsTo('workspace', { inverse: null }),
  submissionOptions: attr(),
  folderOptions: attr(),
  selectionOptions: attr(),
  commentOptions: attr(),
  responseOptions: attr(),
  permissionOptions: attr(),
  copyWorkspaceError: attr('string'),
  createdWorkspace: belongsTo('workspace'),
  createdFolderSet: belongsTo('folder-set'),
});