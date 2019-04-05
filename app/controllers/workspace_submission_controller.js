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
  utils: Ember.inject.service('utility-methods'),
  alert: Ember.inject.service('sweet-alert'),

  queryParams: ['vmtRoomId'],

  // workspaceSubmissions: Ember.inject.controller(),
  // currentSubmission: Ember.computed.alias('workspaceSubmissions.currentSubmission'),
  currentWorkspace: Ember.computed.alias('workspace.model'),
  currentSelection: Ember.computed.alias('workspace.currentSelection'),
  workspaceOwner: Ember.computed.alias('currentWorkspace.owner'),
  permissions: Ember.inject.service('workspace-permissions'),
  guider: Ember.inject.service('guiders-create'),

  areFoldersHidden: false,
  areCommentsHidden: false,

  canSelect: function() {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'selections', 2);
  }.property('currentWorkspace.permissions.@each.{global,selections}'),

  permittedToComment: function() {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'comments', 2);
  }.property('currentWorkspace.permissions.@each.{global,comments}'),

  isMyWorkspace: function() {
    let ownerId = this.get('utils').getBelongsToId(this.get('currentWorkspace'), 'owner');
    return this.get('currentUser.id') === ownerId;
  }.property('currentUser.id', 'currentWorkspace.owner'),

  canRespond: function() {
    return this.get('permissions').canEdit(this.get('currentWorkspace'), 'feedback', 1);
  }.property('currentWorkspace.permissions.@each.{global,feedback}'),

  nonTrashedSelections: function() {
    return this.get('currentWorkspace.selections.content').rejectBy('isTrashed');
  }.property('currentWorkspace.selections.content.@each.isTrashed'),

  nonTrashedTaggings: function() {
    return this.get('currentWorkspace.taggings').rejectBy('isTrashed');
  }.property('currentWorkspace.taggings.@each.isTrashed'),

  nonTrashedFolders: function() {
    return this.get('currentWorkspace.folders.content').rejectBy('isTrashed');
  }.property('currentWorkspace.folders.content.@each.isTrashed'),

  nonTrashedComments: function() {
    return this.get('currentWorkspace.comments.content').rejectBy('isTrashed');
  }.property('currentWorkspace.comments.content.@each.isTrashed'),

  nonTrashedResponses: function() {
    return this.get('currentWorkspace.responses.content').rejectBy('isTrashed');
  }.property('currentWorkspace.responses.content.@each.isTrashed'),

  containerLayoutClass: function() {
    let areFoldersHidden = this.get('areFoldersHidden') || this.get('cannotSeeFolders');
    let areCommentsHidden = this.get('areCommentsHidden') || this.get('cannotSeeComments');

    if (areFoldersHidden && areCommentsHidden) {
      return 'hsh';
    }
    if (areFoldersHidden) {
      return 'hsc';
    }
    if (areCommentsHidden) {
      return 'fsh';
    }
    return 'fsc';
  }.property('areFoldersHidden', 'areCommentsHidden'),

  canSeeFolders: function() {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'folders', 1);
  }.property('currentWorkspace.permissions.@each.{global,folders}'),

  cannotSeeFolders: Ember.computed.not('canSeeFolders'),

  canSeeComments: function() {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'comments', 1);
  }.property('currentWorkspace.permissions.@each.{global,comments}'),

  cannotSeeComments: Ember.computed.not('canSeeComments'),

  showFoldersToggle: function() {
    return this.get('areFoldersHidden') && this.get('canSeeFolders');
  }.property('areFoldersHidden', 'canSeeFolders'),

  showCommentsToggle: function() {
    return this.get('areCommentsHidden') && this.get('canSeeComments');
  }.property('areCommentsHidden', 'canSeeComments'),

  canSeeSelections: function() {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'selections', 1);
  }.property('currentWorkspace.permissions.@each.{global,selections}'),

  cannotSeeSelections: Ember.computed.not('canSeeSelections'),

  canSeeResponses: function() {
    let cws = this.get('currentWorkspace');
    return this.get('permissions').canEdit(cws, 'feedback', 1);

  }.property('currentWorkspace.permissions.@each.{global,feedback}'),

  cannotSeeResponses: Ember.computed.not('canSeeResponses'),

  actions: {
    startTour: function () {
      this.get('guider').createGuider(
        'workspace',
        'submissions',
        'Welcome to your Workspace',
        "Your workspace is a place where you can browse, organize, and comment on submissions.  Let's get started!",
        null, null, null,
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      ).show();
      this.get('guider').createGuider(
        'submissions',
        'submissions.nav',
        'Submissions Area',
        "Your submissions show up here",
        "#al_center",
        "#al_center",
        'rightTop',
        [{name: "Next"}],
        true,
        '250px',
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'submissions.nav',
        'submissions.text',
        'Submission Navigation',
        "You can navigate between submissions using the dropdown or the arrows",
        "#submission-nav",
        "#submission-nav",
        'bottom',
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'submissions.text',
        'submissions.selection',
        'Submission Content',
        "Here is the short and long answer of the submission",
        ".submission-long",
        "#submission_container",
        'bottom',
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'submissions.selection',
        'submissions.selections',
        'Make a Selection',
        "Click the 'Make selection' button to begin making a selection. Then highlight the part of the submission you want to select. <br/><strong>Go ahead and make a selection now.</strong>",
        "#al_center",
        "#al_center",
        9,
        [{name: "Next"}],
        true,
        '200px',
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'submissions.selections',
        'comments',
        "You've made a selection!",
        "Great! Now click on your selection and let's see what we can do with it.",
        "#submission_selections",
        "#al_center",
        3,
        [{name: "Next"}],
        true,
        '300px',
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'comments',
        'comments.comment',
        'Commenting on a Selection',
        "Now that you have chosen a selection you can add comments.  Select one of the comment types: Notice, Wonder, Feedback and type a comment.",
        "#al_right",
        "#al_right",
        'leftTop',
        [{name: "Next"}],
        true,
        '250px',
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'comments.comment',
        'folders',
        'Your Comments Show up Here',
        "The most relevant comments show up at the top and have a darker highlighting.  You can check the box next to the comment to indicate you want to include this comment in your reply.  You'll notice that if there are comments selected you will have another button next to 'Make Selection' called 'Draft Reply'",
        "#al_feedback_display",
        "#al_feedback_display",
        9,
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'folders',
        'folders.counts',
        'Organizing Selections',
        "You can organize your selections by filing them in folders.  Folders contain other folders and can be expanded by clicking on the folder icon.  You can reorganize folders by dragging them into sub-folders.  You can also add and delete folders using the buttons at the bottom",
        "#al_left",
        "#al_left",
        2,
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'folders.counts',
        'fileSelection',
        'Folder Counts',
        "The count shows how many distinct submissions (left) and selections (right) have been filed in this folder (including all of the sub-folders)",
        "#al_folders>li.folderItem:eq(2) aside",
        "#al_folders>li.folderItem:eq(2) aside",
        12,
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'folders.counts',
        'done',
        'Folder Counts',
        "To file a selection, drag it to a folder",
        null, null, null,
        [{name: "Next"}],
        true,
        null,
        this.send('doneTour'),
      );
      this.get('guider').createGuider(
        'done',
        '#takeTour',
        'Tour Completed',
        "You're all done.  If you want to re-take the tour, just hit this button",
        '#takeTour',
        null,
        9,
        [{name: "Close", onclick: this.send('doneTour')}],
        true,
        null,
        this.send('doneTour'),
      );
    },

    doneTour: function() {
      let user = this.get('currentUser');
      user.set('seenTour', new Date());
      user.save();
    },

    cancelComment: function(){
      this.transitionToRoute('workspace.submission');
    },

    addSelection: function(selection, isUpdateOnly) {
      var user = this.get('currentUser');
      var workspace = this.get('currentWorkspace');
      var submission = this.get('model');
      var controller = this;
      var newSelection = null;
      var alreadyExists = this.get('model.selections').filterBy('id', selection.id);

      if(alreadyExists.length > 0) {
        if (isUpdateOnly) {
          let oldSel = alreadyExists.get('firstObject');
          oldSel.set('relativeSize', selection.relativeSize);
          oldSel.set('relativeCoords', selection.relativeCoords);
          oldSel.save();

          return;
        }

        controller.get('alert').showToast('error', 'That selection already exists', 'bottom-end', 3000, false, null);
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
          relativeCoords: selection.relativeCoords,
          relativeSize: selection.relativeSize,
          imageSrc: selection.imageSrc
        });
        break;

      default:
        controller.get('alert').showToast('error', 'Invalid selection type', 'bottom-end', 3000, false, null);

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

          controller.get('alert').showToast('success', 'Selection Created', 'bottom-end', 3000, false, null);

          controller.transitionToRoute('workspace.submission.selection', workspace, submission, newSelection.id);

          guiders.hideAll();

          if(!user.get('seenTour')) {
            //guiders._highlightElement('#al_center'); //shouldn't need to do this...
            //guiders.show('submissions.selections');
          }
        });
      }
    },

    deleteSelection: function(selection) {
      var controller = this;

      selection.set('isTrashed', true);

      selection.get('taggings').forEach(function(tag) {
        tag.set('isTrashed', true);
        tag.save().then(function(record) { record.deleteRecord(); });
      });

      /* Ideally we should handle comments within the comments controller */
      selection.get('comments').forEach(function(comment) {
        comment.set('isTrashed', true);
        comment.save().then(function(record) { record.deleteRecord(); });
      });

      selection.save().then(function(record) {
        record.deleteRecord(); // Locally delete the object to update UI

        controller.get('alert').showToast('success', 'Selection Deleted', 'bottom-end', 3000, false, null);

        controller.transitionToRoute('workspace.submission', controller.get('model'));
      });
    },

    toNewResponse(submission, workspace) {
      this.transitionToRoute('responses.new.submission', submission, {queryParams: {workspaceId: workspace}});
    },
    toSubmission(submission) {
      this.transitionToRoute('workspace.submission', submission);
    },
    toggleFolderDisplay() {
      this.toggleProperty('areFoldersHidden');
    },
    toggleCommentDisplay() {
      this.toggleProperty('areCommentsHidden');
    }
  }
});
