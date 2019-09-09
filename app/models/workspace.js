Encompass.Workspace = DS.Model.extend(Encompass.Auditable, Encompass.Permission, {
  workspaceId: Ember.computed.alias('id'),
  name: DS.attr('string'),
  folders: DS.hasMany('folder', {async: true}),
  submissions: DS.hasMany('submission', {async: true}),
  responses:   DS.hasMany('response', {async: true}),
  selections: DS.hasMany('selection', {async: true}),
  comments: DS.hasMany('comment', {async: true}),
  organization: DS.belongsTo('organization'),
  taggings: DS.hasMany('tagging', {async: false}),
  lastViewed: DS.attr('date'),
  lastModifiedDate: DS.attr('date'),
  lastViewedDate: Ember.computed(function() {
    if (!this.get('lastViewed')) {
      return this.get('lastModifiedDate');
    } else if (!this.get('lastModifiedDate')) {
      return this.get('createDate');
    } else {
      return this.get('lastViewed');
    }
  }),
  lastModifiedDateComp: Ember.computed(function() {
    if (!this.get('lastModifiedDate')) {
      return this.get('createDate');
    } else {
      return this.get('lastModifiedDate');
    }
  }),
  workspaceType: DS.attr('string'),
  childWorkspaces: DS.hasMany('workspace', { inverse: null}),
  parentWorkspaces: DS.hasMany('workspace', { inverse: null }),

  _collectionLength: function(collection) {
    // https://stackoverflow.com/questions/35405360/ember-data-show-length-of-a-hasmany-relationship-in-a-template-without-downloadi
    /*
    if( this.hasMany( collection ).value() === null ) {
      return 0;
    }
    */
    return this.hasMany( collection ).ids().length;
  },
  foldersLength: Ember.computed(function() {
    return this._collectionLength('folders');
  }).property('folders.[]'),
  commentsLength: Ember.computed(function() {
    return this._collectionLength('comments');
  }).property('comments.[]'),
  responsesLength: Ember.computed(function() {
    return this._collectionLength('responses');
  }).property('comments.[]'),
  selectionsLength: Ember.computed(function() {
    return this._collectionLength('selections');
  }).property('selections.[]'),
  submissionsLength: Ember.computed(function() {
    var length = this._collectionLength('submissions');
    return length;
    //return this._collectionLength('submissions');
  }).property('submissions.[]'),
  editorsLength: Ember.computed(function() {
    return this._collectionLength('editors');
  }).property('editors.[]'),
  taggingsLength: Ember.computed(function() {
    return this._collectionLength('taggings');
  }).property('taggings.[]'),

  firstSubmissionId: function() {
    var firstId = this.get('data.submissions.firstObject.id');
    return firstId;
  }.property('submissions'),

  firstSubmission: function(){
    //console.log("First Sub Id: " + this.hasMany( collection ).ids().objectAt(0) );
    return this.hasMany( 'submissions' ).ids()[0];
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
  }.property('submissions.[]'),

  submissionDates: function() {
    var loFmt, lo = this.get('data.submissionSet.description.firstSubmissionDate');
    var hiFmt, hi = this.get('data.submissionSet.description.lastSubmissionDate');
    if(lo > hi) {
      var tmp = lo;
      lo = hi;
      hi = tmp;
    }
    if(lo && hi){
      loFmt = moment(lo).zone('us').format('l');
      hiFmt = moment(hi).zone('us').format('l');
      if(loFmt === hiFmt) {
        return loFmt;
      }
      return loFmt + ' - ' + hiFmt;
    }
  }.property(),
  permissions: DS.attr(),

  collaborators: function() {
    const permissions = this.get('permissions');

    if (Array.isArray(permissions)) {
      return permissions.mapBy('user');
    }
    return [];
  }.property('permissions.[]'),

  feedbackAuthorizers: function() {
    const permissions = this.get('permissions');

    if (Array.isArray(permissions)) {
      return permissions
        .filterBy('feedback', 'approver')
        .mapBy('user');
    }
    return [];
  }.property('permissions.@each.feedback'),
  sourceWorkspace: DS.attr(), // if workspace is copy
  linkedAssignment: DS.belongsTo('assignment'),
  doAllowSubmissionUpdates: DS.attr('boolean', { defaultValue: true }),
  doOnlyUpdateLastViewed: DS.attr('boolean', {defaultValue: false}),
  doAutoUpdateFromChildren: DS.attr('boolean', {defaultValue: false}),

});
