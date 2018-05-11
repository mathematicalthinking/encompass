Encompass.Workspace = DS.Model.extend(Encompass.Auditable, Encompass.Permission, {
  workspaceId: Ember.computed.alias('id'),
  name: DS.attr('string'),
  folders: DS.hasMany('folder', {async: true}),
  submissions: DS.hasMany('submission', {async: true}),
  responses:   DS.hasMany('response', {async: true}),
  selections: DS.hasMany('selection', {async: true}),
  comments: DS.hasMany('comment', {async: true}),
  taggings: DS.hasMany('tagging', {async: false}),
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
  }).property('submissions.[]'),
  firstSubmissionId: function() {
    var firstId = this.get('data.submissions.firstObject.id');
    return firstId;
  }.property('submissions'),

  firstSubmission: function(){
    var controller = this;
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
  }.property()
//  comments: function() {
//    var allComments = [];
//    this.get('submissions').forEach(function(submission){
//      submission.get('selections').forEach(function(selection){
//        selection.get('comments').forEach(function(comment){
//          allComments.push(comment);
//        });
//      });
//    });
//    return allComments;
//  }.property('submissions.@each.selections.@each.comments.@each')

  /*
    Observer that will react on item change and will update the storage.
  */
  //todoChanged: function() {
  //  store.update( this );
  //}.observes( 'title', 'completed' )
});
