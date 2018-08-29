/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
Encompass.WorkspaceSubmissionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, {
  makingSelection: true,
  showingSelections: false,
  isTransitioning: false,

  showSelectableView: Ember.computed('makingSelection', 'showingSelections', 'isTransitioning', function() {
    var making = this.get('makingSelection');
    var showing = this.get('showingSelections');
    var transitioning = this.get('isTransitioning');
    return (making || showing) && !transitioning && !this.switching;
  }),

  shouldCheck: Ember.computed('makingSelection', function() {
    return this.get('makingSelection');
  }),

  didRender: function() {
    console.log('rendering ws-sub');
    if(this.get('switching')) {
      this.set('switching', false);
    }
 },

  /* Next: get selections to show up */

  workspaceSelections: function() {
    console.log('curr sub',this.currentSubmission);
    var selections = this.currentSubmission.get('selections');
    var comp = this;
    var selectionsInWorkspace = null;

    if( !Ember.isNone(selections) ) {
      selectionsInWorkspace = selections.filter( function( selection ){
        var selectionWs = selection.get('workspace.id');
        var thisWs = comp.get('currentWorkspace.id');

        return (selectionWs === thisWs);
      });
    }

    return selectionsInWorkspace;
  }.property('currentSubmission.selections.[]'),

  trashedSelections: function() {
    return this.get('workspaceSelections').filterBy('isTrashed');
  }.property('workspaceSelections.@each.isTrashed'),

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
    addSelection: function( selection ){
      console.log("workspace-submission sending action up to controller...");
      this.sendAction( 'addSelection', selection );
    },

    deleteSelection: function( selection ){
      console.log("workspace-submission sending DELETE action up to controller...");
      this.sendAction( 'deleteSelection', selection );
    },

    showSelections: function() {
      console.log("Show Selections True");
      this.set('showingSelections', true);
    },

    hideSelections: function() {
      console.log('hiding selections');
      this.set('showingSelections', false);
    },
    toggleSelecting: function() {
      var selecting = this.get('makingSelection');
      this.set('makingSelection', !selecting);
    },
    handleTransition: function(isBeginning) {
      console.log('in handleTransition', isBeginning);
      this.get('showSelectableView');
      if (Ember.isEmpty(isBeginning)) {
        return;
      }
      if (isBeginning === true) {
        console.log('setting isTr true');
        this.set('isTransitioning', true);
      } else {
        console.log('setting is Trans false');
        this.set('isTransitioning', false);
      }
    },
    openProblem: function() {
      let answer = this.currentSubmission.get('answer');
      let problem = answer.get('problem');
      let problemId = problem.get('id');

      var getUrl = window.location;
      var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];

      window.open(`${baseUrl}#/problems/${problemId}`, 'newwindow', 'width=1200, height=700');
    },
  }
});

