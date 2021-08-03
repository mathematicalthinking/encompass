import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
/*global _:false */
import { alias } from '@ember/object/computed';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  answerId: alias('id'),
  studentName: attr('string'),
  problem: belongsTo('problem'),
  answer: attr('string'),
  explanation: attr('string'),
  explanationImage: belongsTo('image', { inverse: null }),
  section: belongsTo('section'),
  isSubmitted: attr('boolean'),
  students: hasMany('users', { inverse: null }),
  studentNames: attr(),
  priorAnswer: belongsTo('answer'),
  assignment: belongsTo('assignment', { async: true }),
  additionalImage: belongsTo('image', { inverse: null }),
  workspacesToUpdate: attr(''),
  vmtRoomInfo: attr(),

  isVmt: computed('vmtRoomInfo.roomId', function () {
    let id = this.get('vmtRoomInfo.roomId');
    let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

    return checkForHexRegExp.test(id);
  }),

  student: computed(
    'createdBy.username',
    'studentNames.[]',
    'studentName',
    'isVmt',
    'vmtRoomInfo.participants.[]',
    function () {
      if (this.isVmt) {
        return this.get('vmtRoomInfo.participants.firstObject') || 'Unknown';
      }
      const creatorUsername = this.get('createdBy.username');
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
    }
  ),
});
