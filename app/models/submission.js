import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import moment from 'moment';
import AuditableModel from './auditable';

export default class ResponseModel extends AuditableModel {
  // Alias
  get submissionId() {
    return this.id;
  }

  @attr('string') shortAnswer;
  @attr('string') longAnswer;
  @attr('number') powId; // the ID for this submission in the PoW environment
  @attr() creator;
  @attr('number') creatorId;
  @attr() publication;
  @attr() uploadedFile;
  @attr() teacher;
  @belongsTo('section') section;
  @belongsTo('problem') problem;
  @belongsTo('answer') answer;
  @hasMany('selection', { async: true }) selections;
  @hasMany('comment', { async: true }) comments;
  @hasMany('workspace', { async: true }) workspaces;
  @hasMany('response', { async: true }) responses;
  @attr() vmtRoomInfo;

  get folders() {
    let folders = [];
    this.selections.forEach((selection) => {
      folders.push(...selection.folders);
    });
    return [...new Set(folders)];
  }

  get puzzle() {
    return this.publication?.puzzle;
  }

  get puzzleUrl() {
    return `/library/go.html?destination=${this.puzzle?.puzzleId}`;
  }

  get imageUrl() {
    return `http://mathforum.org/encpows/uploaded-images/${this.uploadedFile?.savedFileName}`;
  }

  get student() {
    let safeName = this.creator?.safeName;
    let fullName = this.creator?.fullName;
    let username = this.creator?.username;
    if (safeName) {
      return safeName;
    }
    if (this.vmtRoomInfo?.roomId) {
      return this.vmtDisplayName;
    }
    if (fullName) {
      return fullName;
    }
    return username;
  }

  get studentDisplayName() {
    if (this.vmtRoomInfo?.roomId) {
      return this.vmtDisplayName;
    }

    let safeName = this.creator?.safeName;
    let username = this.creator?.username;

    return safeName ? safeName : username;
  }

  get label() {
    let label = this.student;
    let createDate = this.createDate;
    if (createDate) {
      label += ` on ${moment(createDate).format('l')}`;
    }
    label += ` (${this.data?.thread?.threadId})`;
    return label;
  }

  get isStatic() {
    return !this.powId;
  }

  get uniqueIdentifier() {
    if (this.isVmt) {
      return this.vmtRoomInfo?.roomId;
    }
    if (this.creator?.studentId) {
      return this.creator.studentId;
    }
    if (this.creator?.username) {
      return this.creator.username;
    }
    return this.creator?.safeName;
  }

  get isVmt() {
    let id = this.vmtRoomInfo?.roomId;
    let checkForHexRegExp = new RegExp('^[0-9a-fA-F]{24}$');
    return checkForHexRegExp.test(id);
  }

  get firstVmtParticipant() {
    return this.vmtRoomInfo?.participants?.[0];
  }

  get firstVmtFacilitator() {
    return this.vmtRoomInfo?.facilitators?.[0];
  }

  get vmtDisplayName() {
    return `VMT Room: ${this.vmtRoomInfo?.roomName}`;
  }
}
