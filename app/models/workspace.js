import AuditableModel from './auditable';
import { attr, belongsTo, hasMany } from '@ember-data/model';
import { format, isValid } from 'date-fns';

export default class WorkspaceModel extends AuditableModel {
  getWorkspaceId() {
    return this.id;
  }

  @attr('string') name;
  @attr('string') mode;
  @belongsTo('user', { async: true }) owner;
  @hasMany('user', { async: true }) editors;
  @hasMany('folder', { async: true }) folders;
  @belongsTo('group', { inverse: null, async: true }) group;
  @hasMany('submission', { async: true }) submissions;
  @hasMany('response', { async: true }) responses;
  @hasMany('selection', { async: true }) selections;
  @hasMany('comments', { async: true }) comments;
  @belongsTo('organization', { async: true }) organization;
  @belongsTo('assignment', { async: true }) linkedAssignment;
  @hasMany('tagging', { async: true }) taggings;
  @attr('date') lastViewed;
  @attr('date') lastModifiedDate;

  get lastViewedDate() {
    if (!this.lastViewed) {
      return this.lastModifiedDate;
    } else if (!this.lastModifiedDate) {
      return this.createDate;
    } else {
      return this.lastViewed;
    }
  }

  get lastModifiedDateComp() {
    if (!this.lastModifiedDate) {
      return this.createDate;
    } else {
      return this.lastModifiedDate;
    }
  }

  @attr('string') workspaceType;
  @hasMany('workspace', { inverse: null, async: true }) childWorkspaces;
  @hasMany('workspace', { inverse: null, async: true }) parentWorkspaces;

  _collectionLength(collections) {
    return this.hasMany(collections).ids().length;
  }

  get foldersLength() {
    return this._collectionLength('folders');
  }

  get commentsLength() {
    return this._collectionLength('comments');
  }

  get responsesLength() {
    return this._collectionLength('responses');
  }

  get selectionsLength() {
    return this._collectionLength('selections');
  }

  get submissionsLength() {
    const length = this._collectionLength('submissions');
    return length;
  }

  get editorsLength() {
    return this._collectionLength('editors');
  }

  get taggingsLength() {
    return this._collectionLength('taggings');
  }

  get firstSubmissionId() {
    const firstId = this.data.submissions.firstObject.id;
    return firstId;
  }

  get firstSubmission() {
    return this.hasMany('submissions').ids()[0];
  }

  get submissionDates() {
    let lo = this.data.submissionSet.description.firstSubmissionDate;
    let hi = this.data.submissionSet.description.lastSubmissionDate;

    if (!(lo instanceof Date) || !(hi instanceof Date)) {
      return null;
    }

    if (!isValid(lo) || !isValid(hi)) {
      return null;
    }

    if (lo > hi) {
      [lo, hi] = [hi, lo]; // swap
    }

    const loFmt = format(lo, 'MM/dd/yyyy'); // equivalent to 'l' in moment
    const hiFmt = format(hi, 'MM/dd/yyyy');

    return loFmt === hiFmt ? loFmt : `${loFmt} - ${hiFmt}`;
  }

  @attr() permissions;
  get collaborators() {
    const permissions = this.permissions;
    if (Array.isArray(permissions)) {
      return permissions.mapBy('user');
    }
    return permissions;
  }

  get feedbackAuthorizers() {
    const permissions = this.permissions;
    if (Array.isArray(permissions)) {
      return permissions.filterBy('feedback', 'approver').mapBy('user');
    }
    return [];
  }

  @attr('') sourceWorkspace;
  @attr('boolean', { defaultValue: true }) doAllowSubmissionUpdates;
  @attr('boolean', { defaultValue: false }) doOnlyUpdateLastViewed;
  @attr('boolean', { defaultValue: false }) doAutoUpdateFromChildren;
}
