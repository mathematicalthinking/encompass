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
  selections: DS.hasMany('selection', { async: true }),
  comments: DS.hasMany('comment', { async: true }),
  workspaces: DS.hasMany('workspace', { async: true }),
  responses: DS.hasMany('response', { async: true }),

  folders: function () {
    var folders = [];
    this.get('selections').forEach(function (selection) {
      folders.pushObjects(selection.get('folders'));
    });
    return folders.uniq();
  }.property('selections.[].folders'),

  selectedComments: function () {
    return this.get('comments').filterBy('useForResponse', true);
  }.property('comments.[].useForResponse'),

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
    return 'http://mathforum.org/encpows/uploaded-images/' + this.get('attachment.savedFileName');
  }.property(),

  student: function () {
    var student = this.get('creator.safeName');
    return student;
  }.property('creator.safeName'),

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
  }.property('powId')
});
