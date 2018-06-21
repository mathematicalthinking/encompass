'use strict';

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

  inWorkspace: function () {
    var controller = this;
    var selections = this.get('selections');

    if (!Ember.isNone(selections)) {
      controller.get('selections').forEach(function (selection) {
        var selectionWs = selection.get('workspace.id');
        var thisWs = controller.get('currentWorkspace.id');
        var belongs = selectionWs === thisWs;

        selection.set('inWorkspace', belongs);
      });
    }
  }.observes('selections.[]'),

  canSelect: function () {
    return Permissions.userCan(this.get('currentUser'), this.get('currentWorkspace'), "SELECTIONS");
  }.property('currentUser.username', 'currentWorkspace.owner.username', 'currentWorkspace.editors.[].username'),

  canFolder: function () {
    return Permissions.userCan(this.get('currentUser'), this.get('currentWorkspace'), "FOLDERS");
  }.property('currentUser', 'currentWorkspace'),

  //permittedToComment: true,
  permittedToComment: function () {
    var cws = this.get('currentWorkspace');
    var owner = cws.get('owner');
    this.get('workspaceOwner').then(function (owner) {
      console.log("WORKSPACE OWNER: " + owner.get('username'));
    });

    var canComment = Permissions.userCan(this.get('currentUser'), this.get('currentWorkspace'), "COMMENTS");

    return canComment;

    /*
    return new Ember.RSVP.Promise(function(resolve){
      cws.get('owner').then( function(owner){
        cws.set('owner', owner);
        var perm = Permissions.userCan(
          this.get('currentUser'),
          this.get('currentWorkspace'),
          "COMMENTS"
        );
        resolve( perm );
        //fetchFacebookPicture(this.get('facebookId'), resolve);
      });
    });
    */
  }.property('currentUser.username', 'currentWorkspace.owner.username', 'currentWorkspace.editors.[].username'),

  currentDragItem: Ember.computed(function () {
    return this.findProperty('isDragging', true);
  }).property('[].isDragging'),

  isMyWorkspace: function () {
    return this.get('currentUser.username') === this.get('currentWorkspace.owner.username');
  }.property('currentUser.username', 'currentWorkspace.owner.username'),

  actions: {
    cancelComment: function cancelComment() {
      console.log("Cancelling comment!");
      this.transitionToRoute('workspace.submission');
    },

    addSelection: function addSelection(selection) {
      console.log("Controller Adding a new selection.");
      var user = this.get('currentUser');
      var workspace = this.get('currentWorkspace');
      var submission = this.get('model');
      var controller = this;
      var newSelection = null;
      var alreadyExists = this.get('model.selections').filterBy('id', selection.id);

      if (alreadyExists.length > 0) {
        console.error("That selection already exists");
        return;
      }

      if (!submission.get('id')) {
        //ENC-475 possibility
        window.alert('uh-oh: this submission looks odd, the selection might not save');
      }

      switch (selection.selectionType) {
        case "selection":
          newSelection = this.get('store').createRecord('selection', {
            text: selection.text,
            submission: submission,
            coordinates: selection.coords,
            workspace: workspace
          });
          break;

        case "image-tag":
          newSelection = this.get('store').createRecord('selection', {
            text: selection.note,
            submission: submission,
            coordinates: selection.parent + ' ' + selection.coords.left + ' ' + selection.coords.top + ' ' + selection.size.width + ' ' + selection.size.height,
            workspace: workspace
          });
          break;

        default:
          console.error('Invalid Selection Type');
          return;
      }

      if (newSelection) {
        newSelection.save().then(function (record) {
          newSelection.set('id', record.get('id'));
          submission.get('selections').then(function (s) {
            s.addObject(record);
          });
          workspace.get('selections').then(function (s) {
            s.addObject(record);
          });
          controller.set('currentSelection', record);

          controller.transitionToRoute('workspace.submission.selection', workspace, submission, newSelection.id);

          guiders.hideAll();

          if (!user.get('seenTour')) {
            console.log('ignoring tour');
            //guiders._highlightElement('#al_center'); //shouldn't need to do this...
            //guiders.show('submissions.selections');
          }
        });
      }
    },

    deleteSelection: function deleteSelection(selection) {
      console.log("W-S controller, delete selection");
      var controller = this;

      selection.set('isTrashed', true);

      selection.get('taggings').forEach(function (tag) {
        //tag.get('workspace').then(function(ws){
        tag.set('isTrashed', true);
        tag.save().then(function (record) {
          record.deleteRecord();
        });
        //});
      });

      /* Ideally we should handle comments within the comments controller */
      selection.get('comments').forEach(function (comment) {
        comment.set('isTrashed', true);
        comment.save().then(function (record) {
          record.deleteRecord();
        });
      });

      selection.save().then(function (record) {
        record.deleteRecord(); // Locally delete the object to update UI
        console.info('deleted selection: ' + record.get('id'));
        controller.transitionToRoute('workspace.submission', controller.get('model'));
      });
    }
  }
});
//# sourceMappingURL=workspace_submission_controller.js.map
