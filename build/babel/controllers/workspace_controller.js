'use strict';

/**
  * # Workspace Controller
  * @description This controller for the workspace assists in linking between submissions
  * @todo Linking between submissions should really be moved to workspace_submissions_index_controller
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
*/
Encompass.WorkspaceController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  comments: Ember.inject.controller(),

  currentSelection: null, //ENC-397, ENC-398

  showOverlay: function () {
    return this.get('makingSelection') || this.get('taggingSelection');
  }.property('makingSelection', 'taggingSelection'),

  actions: {
    popupMaskClicked: function popupMaskClicked() {
      this.transitionToRoute('workspace.submission', this.get('currentSubmission'));
    },
    tagSelection: function tagSelection(selection, tags) {
      console.log('tagging');
    }
  }
});
//# sourceMappingURL=workspace_controller.js.map
