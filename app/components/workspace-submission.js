/**
 * Passed in by template:
 * - currentSubmission
 *
 * selections come from this.currentSubmission.selections
 */
Encompass.WorkspaceSubmissionComponent = Ember.Component.extend(Encompass.CurrentUserMixin, Encompass.ErrorHandlingMixin, {
  makingSelection: true,
  showingSelections: false,
  isTransitioning: false,
  isDirty: false,
  wsSaveErrors: [],
  permissions: Ember.inject.service('workspace-permissions'),

  showSelectableView: Ember.computed('makingSelection', 'showingSelections', 'isTransitioning', function() {
    var making = this.get('makingSelection');
    var showing = this.get('showingSelections');
    var transitioning = this.get('isTransitioning');
    var ws = this.get('currentWorkspace');
    let canSelect = this.get('permissions').canEdit(ws);
    return (making || showing) && !transitioning && !this.switching && canSelect;
  }),

  shouldCheck: Ember.computed('makingSelection', function() {
    return this.get('makingSelection');
  }),



  init: function() {
    this._super(...arguments);
    let start = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }, {
        name: "Close"
      }],
      description: "Your workspace is a place where you can browse, organize, and comment on submissions.  Let's get started.",
      id: "workspace",
      next: "submissions",
      overlay: true,
      title: "Welcome to your Workspace!"
    }).show();
    let step1 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }, {
        name: "Close"
      }],
      description: "Your submissions show up here.",
      id: "submissions",
      next: "submissions.nav",
      attachTo: "#al_center",
      position: 12,
      overlay: true,
      highlight: "#al_center",
      title: "Submissions Area"
    });
    let step2 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }, {
        name: "Close"
      }],
      description: "You can navigate between submissions using the dropdown or the arrows.",
      id: "submissions.nav",
      next: "submissions.text",
      attachTo: "#submission-nav",
      overlay: true,
      width: '200px',
      highlight: "#submission-nav",
      position: 9,
      title: "Submission Navigation"
    });
    let step3 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }, {
        name: "Close"
      }],
      description: "Here is the short and long answer of the submission",
      id: "submissions.text",
      next: "submissions.selection",
      attachTo: "#al_submission>.submission-short",
      overlay: true,
      width: '200px',
      highlight: "#al_submission>#submission_container",
      position: 9,
      title: "Submission Text"
    });

    let step4 = window.guiders.createGuider({
      buttons: [],
      description: "Click the 'Make selection' button to begin making a selection. Then highlight the part of the submission you want to select. <strong>Go ahead and make a selection now.</strong>",
      id: "submissions.selection",
      next: "submissions.selections",
      attachTo: "#al_center",
      overlay: true,
      width: '200px',
      highlight: "#al_center",
      position: 9,
      title: "Make Selection"
    });

    let step5 = window.guiders.createGuider({
      buttons: [],
      description: "Great! Now click on your selection and let's see what we can do with it.",
      id: "submissions.selections",
      next: "comments",
      attachTo: "#submission_selections", //really wanted to attach to this but not working
      overlay: true,
      width: '200px',
      highlight: "#al_center",
      position: 9,
      title: "You've made a selection!"
    });

    let step6 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }, {
        name: "Close"
      }],
      description: "Now that you have chosen a selection you can add comments.  Select one of the comment types: Notice, Wonder, Feedback and type a comment.",
      id: "comments",
      next: "comments.comment",
      attachTo: "#al_right", //really wanted to attach to this but not working
      overlay: true,
      highlight: "#al_right",
      position: 12,
      title: "Commenting on a Selection"
    });

    let step7 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }],
      description: "The most relevant comments show up at the top and have a darker highlighting.  You can check the box next to the comment to indicate you want to include this comment in your reply.  You'll notice that if there are comments selected you will have another button next to 'Make Selection' called 'Draft Reply'.",
      id: "comments.comment",
      next: "folders",
      attachTo: "#al_feedback_display",
      overlay: true,
      highlight: "#al_feedback_display",
      position: 9,
      title: "Your comments show up here."
    });

    let step8 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }],
      description: "You can organize your selections by filing them in folders.  Folders contain other folders and can be expanded by clicking on the folder icon.  You can reorganize folders by dragging them into sub-folders.  You can also add and delete folders using the buttons at the bottom.",
      id: "folders",
      next: "folders.counts",
      attachTo: "#al_left",
      overlay: true,
      highlight: "#al_left",
      position: 2,
      title: "Organizing Selections"
    });
    let step9 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }],
      description: "The count shows how many distinct submissions (left) and selections (right) have been filed in this folder (including all of the sub-folders).",
      id: "folders.counts",
      next: "fileSelection",
      attachTo: "#al_folders>li.folderItem:eq(2) aside",
      overlay: true,
      highlight: "#al_folders>li.folderItem:eq(2) aside",
      position: 12,
      title: "Folder Counts"
    });

    let step10 = window.guiders.createGuider({
      buttons: [{
        name: "Next"
      }],
      description: "To file a selection, drag it to a folder.",
      id: "fileSelection",
      next: "done",
      title: "File Selections in Folders"
    });

    let final = window.guiders.createGuider({
      buttons: [{
        name: "Close",
      }],
      id: "done",
      title: "Done!",
      overlay: true,
      highlight: "#takeTour",
      position: 9,
      attachTo: "#takeTour",
      description: "You're all done.  If you want to re-take the tour, just hit this button."
    });


  },

  didRender: function() {
    if(this.get('switching')) {
      this.set('switching', false);
    }
  },

  willDestroyElement: function() {
    let workspace = this.get('currentWorkspace');

    if (this.get('isDirty')) {
      workspace.set('lastModifiedDate', new Date());
      workspace.set('lastModifiedBy', this.get('currentUser'));
    }

    workspace.save().catch((err) => {
      this.handleErrors(err, 'wsSaveErrors', workspace);
    });

    this._super(...arguments);
  },

  /* Next: get selections to show up */

  workspaceSelections: function() {
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

  canSelect: function () {
    var cws = this.get('currentWorkspace');
    let canEdit = this.get('permissions').canEdit(cws);
    console.log('canEdit in worksapce sub controller is', canEdit);
    return canEdit;
  }.property('currentUser.username', 'currentWorkspace.owner.username', 'currentWorkspace.editors.[].username'),

  actions: {
    addSelection: function( selection ){
      console.log("workspace-submission sending action up to controller...");
      this.set('isDirty', true);
      this.sendAction( 'addSelection', selection );
    },

    deleteSelection: function( selection ){
      console.log("workspace-submission sending DELETE action up to controller...");
      this.set('isDirty', true);
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
      this.get('showSelectableView');
      if (Ember.isEmpty(isBeginning)) {
        return;
      }
      if (isBeginning === true) {
        this.set('isTransitioning', true);
      } else {
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

