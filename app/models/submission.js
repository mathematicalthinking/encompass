import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import moment from 'moment';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  submissionId: alias('id'),
  shortAnswer: attr('string'),
  longAnswer: attr('string'),
  /*
   * the powId is the ID for this submission in the PoW environment
   */
  powId: attr('number'),
  creator: attr(),
  creatorId: attr('number'),
  publication: attr(),
  uploadedFile: attr(),
  //teacher, class, puzzle TODO
  //teacher: DS.belongsTo(App.User, {embedded:'always'}),
  teacher: attr(),
  section: belongsTo('section'),
  problem: belongsTo('problem'),
  answer: belongsTo('answer'),
  selections: hasMany('selection', { async: true }),
  comments: hasMany('comment', { async: true }),
  workspaces: hasMany('workspace', { async: true }),
  responses: hasMany('response', { async: true }),
  vmtRoomInfo: attr(''),

  folders: computed('selections.@each.folders', function () {
    var folders = [];
    this.selections.forEach(function (selection) {
      folders.pushObjects(selection.get('folders'));
    });
    return folders.uniq();
  }),

  // selectedComments: function () {
  //   return this.comments.filterBy('useForResponse', true);
  // }.property('comments.[].useForResponse'),

  puzzle: computed.reads('publication.puzzle'),

  puzzleUrl: computed('puzzle.puzzleId', function () {
    return '/library/go.html?destination=' + this.puzzle.puzzleId;
  }),

  /*
  attachment: function(){
    return this.data.uploadedFile;
  }.property(),
  */

  imageUrl: computed('uploadedFile.savedFileName', function () {
    return (
      'http://mathforum.org/encpows/uploaded-images/' +
      this.uploadedFile.savedFileName
    );
  }),

  student: computed(
    'creator.{fullName,safeName,username}',
    'vmtDisplayName',
    'vmtRoomInfo.roomId',
    function () {
      let safeName = this.creator.safeName;
      let fullName = this.creator.fullName;
      let username = this.creator.username;

      if (this.vmtRoomInfo.roomId) {
        return this.vmtDisplayName;
      }

      if (fullName) {
        return fullName;
      }
      if (safeName) {
        return safeName;
      }
      return username;
    }
  ),

  studentDisplayName: computed(
    'creator.{safeName,username}',
    'vmtDisplayName',
    'vmtRoomInfo.roomId',
    function () {
      if (this.vmtRoomInfo.roomId) {
        return this.vmtDisplayName;
      }

      let safeName = this.creator.safeName;
      let username = this.creator.username;

      let name = safeName ? safeName : username;

      return name;
    }
  ),

  label: computed('student', 'createDate', 'data.thread.threadId', function () {
    var label = this.student;
    var createDate = this.createDate;
    if (createDate) {
      label += ' on ' + moment(createDate).format('l');
    }
    label += ' (' + this.data.thread.threadId + ')';
    return label;
  }),

  isStatic: computed.not('powId'),
  uniqueIdentifier: computed(
    'creator.{safeName,studentId,username}',
    'isVmt',
    'vmtRoomInfo.roomId',
    function () {
      // vmt room
      if (this.isVmt) {
        return this.vmtRoomInfo.roomId;
      }
      // encompass user
      if (this.creator.studentId) {
        return this.creator.studentId;
      }

      // pows username
      if (this.creator.username) {
        return this.creator.username;
      }
      return this.creator.safeName;
    }
  ),

  isVmt: computed('vmtRoomInfo.roomId', function () {
    let id = this.vmtRoomInfo.roomId;
    let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');

    return checkForHexRegExp.test(id);
  }),

  firstVmtParticipant: computed.reads('vmtRoomInfo.participants.firstObject'),
  firstVmtFacilitator: computed.reads('vmtRoomInfo.facilitators.firstObject'),
  vmtDisplayName: computed('vmtRoomInfo.roomName', function () {
    return `VMT Room: ${this.vmtRoomInfo.roomName}`;
  }),
});
