import { attr, belongsTo } from '@ember-data/model';
import Auditable from './auditable';
export default class NewWorkspaceRequestModel extends Auditable {
  @attr('string') pdSetName;
  @attr('string') folderSetName;
  @belongsTo('workspace', { async: true }) result;
}
