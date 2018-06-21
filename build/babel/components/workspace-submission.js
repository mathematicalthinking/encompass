'use strict';

/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
Encompass.WorkspaceSubmissionComponent = Ember.Component.extend({
  makingSelection: true,
  showingSelections: false,

  showSelectableView: Ember.computed.or('makingSelection', 'showingSelections'),
  /* Next: get selections to show up */

  workspaceSelections: function () {
    console.log('curr sub', this.currentSubmission);
    var selections = this.currentSubmission.get('selections');
    var comp = this;
    var selectionsInWorkspace = null;

    if (!Ember.isNone(selections)) {
      selectionsInWorkspace = selections.filter(function (selection) {
        var selectionWs = selection.get('workspace.id');
        var thisWs = comp.get('currentWorkspace.id');

        return selectionWs === thisWs;
      });
    }

    return selectionsInWorkspace;
  }.property('currentSubmission.selections.[]'),

  canSelect: true,

  /* TODO: fix this:
  canSelect: function() {
    return Permissions.userCan(
      this.get('this.currentUser'),
      this.get('this.currentWorkspace'),
      "SELECTIONS"
    );
  }.property('this.currentUser.username', 'this.currentWorkspace.owner.username', 'this.currentWorkspace.editors.[].username'),
  */

  actions: {
    addSelection: function addSelection(selection) {
      console.log("workspace-submission sending action up to controller...");
      this.sendAction('addSelection', selection);
    },

    deleteSelection: function deleteSelection(selection) {
      console.log("workspace-submission sending DELETE action up to controller...");
      this.sendAction('deleteSelection', selection);
    },

    showSelections: function showSelections() {
      console.log("Show Selections True");
      this.set('showingSelections', true);
    },

    hideSelections: function hideSelections() {
      this.set('showingSelections', false);
    }
  }
});
//# sourceMappingURL=workspace-submission.js.map
