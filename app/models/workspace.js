import { attr, belongsTo, hasMany } from '@ember-data/model';
import moment from 'moment';
import _ from 'underscore';
import Auditable from './auditable';
export default class WorkspaceModel extends Auditable {
  getWorkspaceId() {
    return this.id;
  }
  @attr('string') name;
  @attr('string') mode;
  @belongsTo('user', { async: true }) owner;
  @hasMany('user', { async: true }) editors;
  @hasMany('folder', { async: true }) folders;
  @attr() group;
  @hasMany('submission', { async: true }) submissions;
  @hasMany('response', { async: true }) responses;
  @hasMany('selection', { async: true }) selections;
  @hasMany('comment', { async: true }) comments;
  @belongsTo('organization') organization;
  @belongsTo('assignment') linkedAssignment;
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
  @hasMany('workspace', { inverse: null }) childWorkspaces;
  @hasMany('workspace', { inverse: null }) parentWorkspaces;

  _collectionLength(collections) {
    // https://stackoverflow.com/questions/35405360/ember-data-show-length-of-a-hasmany-relationship-in-a-template-without-downloadi
    /*
    if( this.hasMany( collection ).value() === null ) {
      return 0;
    }
    */
    return this.hasMany(collections).ids().length;
  }
  // @tracked folders = [];
  get foldersLength() {
    return this._collectionLength('folders');
  }
  // @tracked comments = [];
  get commentsLength() {
    return this._collectionLength('comments');
  }
  get responsesLength() {
    return this._collectionLength('responses');
  }
  // @tracked selections = [];
  get selectionsLength() {
    return this._collectionLength('selections');
  }
  get submissionsLength() {
    const length = this._collectionLength('submissions');
    return length;
    //return this._collectionLength('submissions');
  }
  // @tracked submissions = [];
  get editorsLength() {
    return this._collectionLength('editors');
  }
  // @tracked taggings = [];
  get taggingsLength() {
    return this._collectionLength('taggings');
  }

  get firstSubmissionId() {
    const firstId = this.data.submissions.firstObject.id;
    return firstId;
  }

  get firstSubmission() {
    //console.log("First Sub Id: " + this.hasMany( collection ).ids().objectAt(0) );
    return this.hasMany('submissions').ids()[0];
    /*
    var promise = new Ember.RSVP.Promise(function(resolve, reject) {
      console.log("Getting first submission!");
      controller.get('submissions').then(function(submissions){
        console.log("Length: " + submissions.get('length') );
        var sorted = submissions.sortBy('student', 'createDate');
        var firstStudent = sorted.get('firstObject.student');
        var lastRevision = sorted.getEach('student').lastIndexOf(firstStudent);

        return sorted.objectAt(lastRevision);
      });
    });

    return promise;
    */
  }

  get submissionDates() {
    let loFmt,
      lo = this.data.submissionSet.description.firstSubmissionDate;
    let hiFmt,
      hi = this.data.submissionSet.description.lastSubmissionDate;
    if (lo > hi) {
      const tmp = lo;
      lo = hi;
      hi = tmp;
    }
    if (lo && hi) {
      loFmt = moment(lo).zone('us').format('l');
      hiFmt = moment(hi).zone('us').format('l');
      if (loFmt === hiFmt) {
        return loFmt;
      }
      return loFmt + ' - ' + hiFmt;
    }
    return null;
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
  @attr('') sourceWorkspace; // if workspace is copy
  // @belongsTo('assignment') linkedAssignment;
  @attr('boolean', { defaultValue: true }) doAllowSubmissionUpdates;
  @attr('boolean', { defaultValue: false }) doOnlyUpdateLastViewed;
  @attr('boolean', { defaultValue: false }) doAutoUpdateFromChildren;
}
