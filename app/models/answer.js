import { attr, belongsTo, hasMany } from '@ember-data/model';
import _ from 'underscore';
import Auditable from './auditable';

export default class AnswerModel extends Auditable {
  get answerId() {
    return this.id;
  }
  @attr('string') studentName;
  @belongsTo('problem') problem;
  @attr('string') answer;
  @attr('string') explanation;
  @belongsTo('image', { inverse: null }) explanationImage;
  @belongsTo('section') section;
  @attr('boolean') isSubmitted;
  @hasMany('users', { inverse: null }) students;
  @attr studentNames;
  @belongsTo('answer') priorAnswer;
  @belongsTo('assignment', { async: true }) assignment;
  @belongsTo('image', { inverse: null }) additionalImage;
  @attr workspacesToUpdate;
  @attr vmtRoomInfo;
  get isVmt() {
    let id = this.vmtRoomInfo.roomId;
    let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

    return checkForHexRegExp.test(id);
  }
  get student() {
    if (this.isVmt) {
      return this.vmtRoomInfo.participants.firstObject || 'Unknown';
    }
    const creatorUsername = this.createdBy.username;
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
