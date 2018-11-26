/**
  * # Workspace Submissions First Route
  * @description This route simply forwards the user to the first submission
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspaceSubmissionsFirstRoute = Ember.Route.extend({

  model: function(){
    var workspace = this.modelFor('workspace');
    return workspace.get('submissions');
  },

  afterModel: function(submissions, transition) {
    var workspace = this.modelFor('workspace');
    if(submissions.get('length') > 0) {
      var sorted = submissions.sortBy('student', 'createDate');
      var firstStudent = sorted.get('firstObject.student');
      var lastRevision = sorted.getEach('student').lastIndexOf(firstStudent);

      this.transitionTo('workspace.submission', workspace, sorted.objectAt(lastRevision));
    }
  }

});
