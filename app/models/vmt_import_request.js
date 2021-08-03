import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import Auditable from '../models/_auditable_mixin';


export default Model.extend(Auditable, {
  workspaceName: attr('string'),
  workspaceMode: attr('string'),
  workspaceOwner: belongsTo('user', { inverse: null }),
  folderSet: belongsTo('folder-set', { inverse: null }),
  vmtRooms: attr(),
  permissionObjects: attr(),
  createdWorkspace: belongsTo('workspace'),
  createdAnswers: hasMany('answer', { inverse: null }),
  createdSubmissions: hasMany('submission', { inverse: null }),
  createWorkspaceError: attr('string'),
  doCreateWorkspace: attr('boolean'),

});