import { belongsTo, attr, hasMany } from '@ember-data/model';
import Auditable from './auditable';

export default class EncWorkspaceRequestModel extends Auditable {
  @belongsTo('user', { inverse: null, async: true }) teacher;
  @belongsTo('assignment', { inverse: null, async: true }) assignment;
  @belongsTo('problem', { inverse: null, async: true }) problem;
  @belongsTo('section', { inverse: null, async: true }) section;
  @attr('date') startDate;
  @attr('date') endDate;
  @attr('string') pdSetName;
  @belongsTo('folderSet', { inverse: null, async: true }) folderSet;
  @attr('string') requestedName;
  @belongsTo('workspace', { async: true }) createdWorkspace;
  @attr('boolean', { defaultValue: null }) isEmptyAnswerSet;
  @attr('string') createWorkspaceError;
  @belongsTo('user', { inverse: null, async: true }) owner;
  @attr('string') mode;
  @hasMany('answer', { inverse: null, async: true }) answers;
  @attr newAnswerSet;
  @attr permissionObjects;
}
