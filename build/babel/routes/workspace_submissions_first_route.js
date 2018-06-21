'use strict';

/**
  * # Workspace Submissions First Route
  * @description This route simply forwards the user to the first submission
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.1
  */
Encompass.WorkspaceSubmissionsFirstRoute = Ember.Route.extend({

  model: function model() {
    var workspace = this.modelFor('workspace');
    console.log("W-S Frist route, for workspace: " + workspace.get('id'));
    return workspace.get('submissions');
  },

  afterModel: function afterModel(submissions, transition) {
    console.log('in after model.. NOT', submissions);
    var workspace = this.modelFor('workspace');
    console.log("W-S First Route, num of submissions: " + submissions.get('length'));
    if (submissions.get('length') > 0) {
      var sorted = submissions.sortBy('student', 'createDate');
      var firstStudent = sorted.get('firstObject.student');
      var lastRevision = sorted.getEach('student').lastIndexOf(firstStudent);

      this.transitionTo('workspace.submission', workspace, sorted.objectAt(lastRevision));
    }
  }

});
//# sourceMappingURL=workspace_submissions_first_route.js.map
