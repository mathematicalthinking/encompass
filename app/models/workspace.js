import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import * as dayjs from 'dayjs';
import Auditable from '../models/_auditable_mixin';

export default Model.extend(Auditable, {
  workspaceId: alias('id'),
  name: attr('string'),
  mode: attr('string'),
  owner: belongsTo('user', { async: true }),
  editors: hasMany('user', { async: true }),
  folders: hasMany('folder', { async: true }),
  group: attr(),
  submissions: hasMany('submission', { async: true }),
  responses: hasMany('response', { async: true }),
  selections: hasMany('selection', { async: true }),
  comments: hasMany('comment', { async: true }),
  organization: belongsTo('organization'),
  taggings: hasMany('tagging', { async: true }),
  lastViewed: attr('date'),
  lastModifiedDate: attr('date'),
  lastViewedDate: computed(function () {
    if (!this.lastViewed) {
      return this.lastModifiedDate;
    } else if (!this.lastModifiedDate) {
      return this.createDate;
    } else {
      return this.lastViewed;
    }
  }),
  lastModifiedDateComp: computed(function () {
    if (!this.lastModifiedDate) {
      return this.createDate;
    } else {
      return this.lastModifiedDate;
    }
  }),
  workspaceType: attr('string'),
  childWorkspaces: hasMany('workspace', { inverse: null }),
  parentWorkspaces: hasMany('workspace', { inverse: null }),

  _collectionLength: function (collection) {
    // https://stackoverflow.com/questions/35405360/ember-data-show-length-of-a-hasmany-relationship-in-a-template-without-downloadi
    /*
    if( this.hasMany( collection ).value() === null ) {
      return 0;
    }
    */
    return this.hasMany(collection).ids().length;
  },
  foldersLength: computed('folders.[]', function () {
    return this._collectionLength('folders');
  }),
  commentsLength: computed('comments.[]', function () {
    return this._collectionLength('comments');
  }),
  responsesLength: computed('comments.[]', function () {
    return this._collectionLength('responses');
  }),
  selectionsLength: computed('selections.[]', function () {
    return this._collectionLength('selections');
  }),
  submissionsLength: computed('submissions.[]', function () {
    var length = this._collectionLength('submissions');
    return length;
    //return this._collectionLength('submissions');
  }),
  editorsLength: computed('editors.[]', function () {
    return this._collectionLength('editors');
  }),
  taggingsLength: computed('taggings.[]', function () {
    return this._collectionLength('taggings');
  }),

  firstSubmissionId: computed('submissions', function () {
    var firstId = this.get('data.submissions.firstObject.id');
    return firstId;
  }),

  firstSubmission: computed('submissions.[]', function () {
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
  }),

  submissionDates: computed(function () {
    var loFmt,
      lo = this.get('data.submissionSet.description.firstSubmissionDate');
    var hiFmt,
      hi = this.get('data.submissionSet.description.lastSubmissionDate');
    if (lo > hi) {
      var tmp = lo;
      lo = hi;
      hi = tmp;
    }
    if (lo && hi) {
      loFmt = dayjs(lo).format('M/D/YYYY');
      hiFmt = dayjs(hi).format('M/D/YYYY');
      if (loFmt === hiFmt) {
        return loFmt;
      }
      return loFmt + ' - ' + hiFmt;
    }
  }),
  permissions: attr(),

  collaborators: computed('permissions.[]', function () {
    const permissions = this.permissions;

    if (Array.isArray(permissions)) {
      return permissions.mapBy('user');
    }
    return [];
  }),

  feedbackAuthorizers: computed('permissions.@each.feedback', function () {
    const permissions = this.permissions;

    if (Array.isArray(permissions)) {
      return permissions.filterBy('feedback', 'approver').mapBy('user');
    }
    return [];
  }),
  sourceWorkspace: attr(), // if workspace is copy
  linkedAssignment: belongsTo('assignment'),
  doAllowSubmissionUpdates: attr('boolean', { defaultValue: true }),
  doOnlyUpdateLastViewed: attr('boolean', { defaultValue: false }),
  doAutoUpdateFromChildren: attr('boolean', { defaultValue: false }),
});
