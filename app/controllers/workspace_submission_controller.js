/**
  * # Workspace Submission Controller
  * @description The controller for interacting with a submission in the context of a workspace
  *              This is used to set the dependency on the workspace controller and add and delete
  *              selections
  * @author Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
*/
Encompass.WorkspaceSubmissionController = Ember.Controller.extend(Encompass.CurrentUserMixin, {
  workspace: Ember.inject.controller(),
  //comments: Ember.inject.controller(),
  workspaceSubmissions: Ember.inject.controller(),
  currentSubmission: Ember.computed.alias('workspaceSubmissions.currentSubmission'),
  currentWorkspace: Ember.computed.alias('workspace.model'),
  currentSelection: Ember.computed.alias('workspace.currentSelection'),
  workspaceOwner: Ember.computed.alias('currentWorkspace.owner'),
  permissions: Ember.inject.service('workspace-permissions'),
  guider: Ember.inject.service('guiders-create'),


  inWorkspace: function() {
    var controller = this;
    var selections = this.get('selections');

    if( !Ember.isNone(selections) ) {
      controller.get('selections').forEach(function(selection) {
        var selectionWs = selection.get('workspace.id');
        var thisWs = controller.get('currentWorkspace.id');
        var belongs = (selectionWs === thisWs);

        selection.set('inWorkspace', belongs);
      });
    }
  }.observes('selections.[]'),

  canSelect: function() {
    var cws = this.get('currentWorkspace');
    let canEdit = this.get('permissions').canEdit(cws);
    console.log('canEdit in worksapce sub controller is', canEdit);
    return canEdit;
  }.property('currentUser.username', 'currentWorkspace.owner.username', 'currentWorkspace.editors.[].username'),

  canFolder: function() {
    return Permissions.userCan(
      this.get('currentUser'),
      this.get('currentWorkspace'),
      "FOLDERS"
    );
  }.property('currentUser', 'currentWorkspace'),

  //permittedToComment: true,
  permittedToComment: function() {
    var cws = this.get('currentWorkspace');
    let canComment = this.get('permissions').canEdit(cws);
    console.log('canComment', canComment);
    return canComment;
  }.property('currentUser.username', 'currentWorkspace.owner.username', 'currentWorkspace.editors.[].username'),

  currentDragItem: Ember.computed(function(){
    return this.findProperty('isDragging', true);
  }).property('[].isDragging'),

  isMyWorkspace: function() {
    return this.get('currentUser.username') === this.get('currentWorkspace.owner.username');
  }.property('currentUser.username', 'currentWorkspace.owner.username'),

  actions: {
    startTour: function () {
      this.get('guider').createGuider(
        'workspace',
        'submissions',
        'Welcome to your Workspace!',
        "Your workspace is a place where you can browse, organize, and comment on submissions.  Let's get started!",null, null, null,
        [{name: "Next"}],
        true,
        null
      ).show();

      this.get('guider').createGuider(
        'submissions',
        'submissions.nav',
        'Submissions Area',
        "Your submissions show up here",
        "#al_center",
        "#al_center",
        12,
        [{name: "Next"}],
        true,
        null
      );

      this.get('guider').createGuider(
        'submissions.nav',
        'submissions.text',
        'Submission Navigation',
        "You can navigate between submissions using the dropdown or the arrows",
        "#submission-nav",
        "#submission-nav",
        9,
        [{name: "Next"}],
        true,
        '200px',
        null
      );
      window.guiders.createGuider({
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

      window.guiders.createGuider({
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

      window.guiders.createGuider({
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

      window.guiders.createGuider({
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

      window.guiders.createGuider({
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

      window.guiders.createGuider({
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
      window.guiders.createGuider({
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

       window.guiders.createGuider({
        buttons: [{
          name: "Next"
        }],
        description: "To file a selection, drag it to a folder.",
        id: "fileSelection",
        next: "done",
        title: "File Selections in Folders"
      });

      window.guiders.createGuider({
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

    cancelComment: function(){
      console.log("Cancelling comment!");
      this.transitionToRoute('workspace.submission');
    },

    addSelection: function(selection) {
      console.log("Controller Adding a new selection.");
      var user = this.get('currentUser');
      var workspace = this.get('currentWorkspace');
      var submission = this.get('model');
      var controller = this;
      var newSelection = null;
      var alreadyExists = this.get('model.selections').filterBy('id', selection.id);

      if(alreadyExists.length > 0) {
        console.error("That selection already exists");
        return;
      }

      if(!submission.get('id')) { //ENC-475 possibility
        window.alert('uh-oh: this submission looks odd, the selection might not save');
      }

      switch (selection.selectionType) {
      case "selection":
        newSelection = this.get('store').createRecord('selection', {
          text: selection.text,
          submission: submission,
          coordinates: selection.coords,
          workspace: workspace,
          createdBy: user,
        });
        break;

      case "image-tag":
        newSelection = this.get('store').createRecord('selection', {
          text: selection.note,
          submission: submission,
          coordinates: selection.parent + ' ' +
              selection.coords.left + ' ' +
              selection.coords.top + ' ' +
              selection.size.width + ' ' +
              selection.size.height,
          workspace: workspace,
          createdBy: user,
        });
        break;

      default:
        console.error('Invalid Selection Type');
        return;
      }

      if(newSelection) {
        newSelection.save().then(function(record) {
          newSelection.set('id', record.get('id') );
          submission.get('selections').then(function(s){
            s.addObject(record);
          });
          workspace.get('selections').then(function(s){
            s.addObject(record);
          });
          controller.set('currentSelection', record);

          controller.transitionToRoute('workspace.submission.selection', workspace, submission, newSelection.id);

          guiders.hideAll();

          if(!user.get('seenTour')) {
            console.log('ignoring tour');
            //guiders._highlightElement('#al_center'); //shouldn't need to do this...
            //guiders.show('submissions.selections');
          }
        });
      }
    },

    deleteSelection: function(selection) {
      console.log("W-S controller, delete selection");
      var controller = this;

      selection.set('isTrashed', true);

      selection.get('taggings').forEach(function(tag) {
        //tag.get('workspace').then(function(ws){
        tag.set('isTrashed', true);
        tag.save().then(function(record) { record.deleteRecord(); });
        //});
      });

      /* Ideally we should handle comments within the comments controller */
      selection.get('comments').forEach(function(comment) {
        comment.set('isTrashed', true);
        comment.save().then(function(record) { record.deleteRecord(); });
      });

      selection.save().then(function(record) {
        record.deleteRecord(); // Locally delete the object to update UI
        console.info('deleted selection: ' + record.get('id'));
        controller.transitionToRoute('workspace.submission', controller.get('model'));
      });
    },
  }
});
