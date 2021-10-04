import { belongsTo, attr, hasMany } from '@ember-data/model';
import Auditable from './auditable';

export default class EncWorkspaceRequestModel extends Auditable {
  @belongsTo('user', { inverse: null }) teacher;
  @belongsTo('assignment', { inverse: null }) assignment;
  @belongsTo('problem', { inverse: null }) problem;
  @belongsTo('section', { inverse: null }) section;
  @attr('date') startDate;
  @attr('date') endDate;
  @attr('string') pdSetName;
  @belongsTo('folderSet', { inverse: null }) folderSet;
  @attr('string') requestedName;
  @belongsTo('workspace') createdWorkspace;
  @attr('boolean', { defaultValue: null }) isEmptyAnswerSet;
  @attr('string') createWorkspaceError;
  @belongsTo('user', { inverse: null }) owner;
  @attr('string') mode;
  @hasMany('answer', { inverse: null }) answers;
  @attr newAnswerSet;
  @attr permissionObjects;
}
