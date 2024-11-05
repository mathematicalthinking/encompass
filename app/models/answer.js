import { attr, belongsTo, hasMany } from '@ember-data/model';
import _ from 'underscore';
import AuditableModel from './auditable';

export default class AnswerModel extends AuditableModel {
  get answerId() {
    return this.id;
  }
  @attr('string') studentName;
  @belongsTo('problem', { async: true }) problem;
  @attr('string') answer;
  @attr('string') explanation;
  @belongsTo('image', { inverse: null, async: true }) explanationImage;
  @belongsTo('section', { async: true }) section;
  @attr('boolean') isSubmitted;
  @hasMany('users', { inverse: null, async: true }) students;
  @attr studentNames;
  @belongsTo('answer', { inverse: null, async: true }) priorAnswer;
  @belongsTo('assignment', { async: true }) assignment;
  @belongsTo('image', { inverse: null, async: true }) additionalImage;
  @attr workspacesToUpdate;
  @attr vmtRoomInfo;
  get isVmt() {
    if (this.vmtRoomInfo) {
      let id = this.vmtRoomInfo.roomId;
      let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

      return checkForHexRegExp.test(id);
    }
    return false;
  }
  get student() {
    if (this.isVmt) {
      return this.vmtRoomInfo.participants.firstObject || 'Unknown';
    }
    const creatorUsername = this.createdBy.get('username');
    if (creatorUsername && creatorUsername !== 'old_pows_user') {
      return creatorUsername;
    }
    const studentName = this.studentName;
    if (typeof studentName === 'string') {
      return studentName.trim();
    }

    const names = this.studentNames;

    if (Array.isArray(names)) {
      let firstStringName = _.find(names, _.isString);
      if (firstStringName) {
        return firstStringName.trim();
      }
    }
    return '';
  }
}
