Encompass.Submission = DS.Model.extend(Encompass.Auditable, {
  submissionId: Ember.computed.alias('id'),
  shortAnswer: DS.attr('string'),
  longAnswer: DS.attr('string'),
  /*
   * the powId is the ID for this submission in the PoW environment
   */
  powId: DS.attr('number'),
  creator: DS.attr(),
  creatorId: DS.attr('number'),
  publication: DS.attr(),
  uploadedFile: DS.attr(),
  //teacher, class, puzzle TODO
  //teacher: DS.belongsTo(App.User, {embedded:'always'}),
  teacher: DS.attr(),
  section: DS.belongsTo('section'),
  problem: DS.belongsTo('problem'),
  answer: DS.belongsTo('answer'),
  selections: DS.hasMany('selection', { async: true }),
  comments: DS.hasMany('comment', { async: true }),
  workspaces: DS.hasMany('workspace', { async: true }),
  responses: DS.hasMany('response', { async: true }),
  vmtRoomInfo: DS.attr(''),

  folders: function () {
    var folders = [];
    this.get('selections').forEach(function (selection) {
      folders.pushObjects(selection.get('folders'));
    });
    return folders.uniq();
  }.property('selections.[].folders'),

  // selectedComments: function () {
  //   return this.get('comments').filterBy('useForResponse', true);
  // }.property('comments.[].useForResponse'),

  puzzle: function () {
    return this.get('publication.puzzle');
  }.property(),

  puzzleUrl: function () {
    return '/library/go.html?destination=' + this.get('puzzle.puzzleId');
  }.property(),

  /*
  attachment: function(){
    return this.get('data.uploadedFile');
  }.property(),
  */

  imageUrl: function () {
    return 'http://mathforum.org/encpows/uploaded-images/' + this.get('uploadedFile.savedFileName');
  }.property(),

  student: function () {
    var safeName = this.get('creator.safeName');
    var fullName = this.get('creator.fullName');
    var username = this.get('creator.username');

    if (fullName) {
      return fullName;
    }
    if (safeName) {
      return safeName;
    }
    return username;
  }.property('creator.safeName', 'creator.username', 'creator.fullName'),

  studentDisplayName: function() {
    var safeName = this.get('creator.safeName');
    var username = this.get('creator.username');

    var name = safeName ? safeName : username;

    return name;

  }.property('creator.safeName', 'creator.username'),

  label: function () {
    var label = this.get('student');
    var createDate = this.get('createDate');
    if (createDate) {
      label += ' on ' + moment(createDate).format('l');
    }
    label += ' (' + this.get('data.thread.threadId') + ')';
    return label;
  }.property('student', 'createDate', 'data.thread.threadId'),

  isStatic: function () {
    return !this.get('powId');
  }.property('powId'),
  uniqueIdentifier: function() {
    // encompass user
    if (this.get('creator.studentId')) {
      return this.get('creator.studentId');
    }

    // pows username
    if (this.get('creator.username')) {
      return this.get('creator.username');
    }
    return this.get('creator.safeName');

  }.property('creator.username', 'creator.studentId'),
});
