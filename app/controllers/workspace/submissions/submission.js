import Controller, { inject as controller } from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class WorkspaceSubmissionController extends Controller {
  @controller workspace;
  @service('utility-methods') utils;
  @service('sweet-alert') alert;
  @service store;
  @tracked queryParams = ['vmtRoomId'];
  @service('assignment-permissions') permissionsService;
  // Tracked properties
  @tracked currentWorkspace = this.workspace.model;
  @tracked currentSelection = this.workspace.currentSelection;
  @tracked workspaceOwner = this.currentWorkspace.owner;
  @tracked guider = this.guider;

  @tracked showOptions = true;
  @tracked areFoldersHidden = false;
  @tracked areCommentsHidden = false;
  @tracked itemsToDisplay = 'all';
  @tracked isParentWorkspace = this.currentWorkspace.workspaceType === 'parent';

  get canSelect() {
    let cws = this.currentWorkspace;
    return this.permissions.canEdit(cws, 'selections', 2);
  }

  get permittedToComment() {
    let cws = this.currentWorkspace;
    return this.permissions.canEdit(cws, 'comments', 2);
  }

  get isMyWorkspace() {
    let ownerId = this.utils.getBelongsToId(this.currentWorkspace, 'owner');
    return this.currentUser.id === ownerId;
  }

  get canRespond() {
    return this.permissions.canEdit(this.currentWorkspace, 'feedback', 1);
  }

  get nonTrashedSelections() {
    const nonTrashed =
      this.currentWorkspace.selections.content.rejectBy('isTrashed');
    if (this.itemsToDisplay === 'all') {
      return nonTrashed;
    }
    if (this.itemsToDisplay === 'individual') {
      return nonTrashed.filter((selection) => {
        const originalSelection = selection.get('originalSelection');
        const workspace = originalSelection.get('workspace');
        if (workspace) {
          const group = workspace.get('group');
          return !group;
        }
        return false;
      });
    }
    if (this.itemsToDisplay === 'group') {
      return nonTrashed.filter((selection) => {
        const originalSelection = selection.get('originalSelection');
        const workspace = originalSelection.get('workspace');
        if (workspace) {
          const group = workspace.get('group');
          return !!group;
        }
        return false;
      });
    }
  }

  get nonTrashedTaggings() {
    return this.currentWorkspace.taggings.rejectBy('isTrashed');
  }

  get nonTrashedFolders() {
    return this.currentWorkspace.folders.content.rejectBy('isTrashed');
  }

  get nonTrashedComments() {
    const nonTrashed =
      this.currentWorkspace.comments.content.rejectBy('isTrashed');
    if (this.itemsToDisplay === 'all') {
      return nonTrashed;
    }
    if (this.itemsToDisplay === 'individual') {
      return nonTrashed.filter((comment) => {
        const originalComment = comment.get('originalComment');
        const workspace = originalComment.get('workspace');
        if (workspace) {
          const group = workspace.get('group');
          return !group;
        }
        return false;
      });
    }
    if (this.itemsToDisplay === 'group') {
      return nonTrashed.filter((comment) => {
        const originalComment = comment.get('originalComment');
        const workspace = originalComment.get('workspace');
        if (workspace) {
          const group = workspace.get('group');
          return !!group;
        }
        return false;
      });
    }
    return '';
  }

  get nonTrashedResponses() {
    return this.currentWorkspace.responses.content.rejectBy('isTrashed');
  }

  get containerLayoutClass() {
    let areFoldersHidden = this.areFoldersHidden || this.cannotSeeFolders;
    let areCommentsHidden = this.areCommentsHidden || this.cannotSeeComments;

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
  }

  get canSeeFolders() {
    let cws = this.currentWorkspace;
    return this.permissions.canEdit(cws, 'folders', 1);
  }

  get cannotSeeFolders() {
    return !this.canSeeFolders;
  }

  get canSeeComments() {
    let cws = this.currentWorkspace;
    return this.permissions.canEdit(cws, 'comments', 1);
  }

  // Feature is disabled below - primarily used to disable viewing comments for students in parent workspaces.
  // get cannotSeeComments() {
  //   return !this.canSeeComments;
  // }

  get showFoldersToggle() {
    return this.areFoldersHidden && this.canSeeFolders;
  }

  get showCommentsToggle() {
    return this.areCommentsHidden && this.canSeeComments;
  }

  get canSeeSelections() {
    let cws = this.currentWorkspace;

    return this.permissions.canEdit(cws, 'selections', 1);
  }

  get cannotSeeSelections() {
    return !this.canSeeSelections;
  }

  get canSeeResponses() {
    let cws = this.currentWorkspace;
    console.log(this), 'here';
    return this.permissions.canEdit(cws, 'feedback', 1);
  }

  get cannotSeeResponses() {
    return !this.canSeeResponses;
  }

  // Actions
  @action
  updateDisplayInput({ target }) {
    this.itemsToDisplay = target.value;
  }

  @action
  startTour() {
    this.guider
      .createGuider(
        'workspace',
        'submissions',
        'Welcome to your Workspace',
        "Your workspace is a place where you can browse, organize, and comment on submissions.  Let's get started!",
        null,
        null,
        null,
        [{ name: 'Next' }],
        true,
        null,
        this.send('doneTour')
      )
      .show();
    this.guider.createGuider(
      'submissions',
      'submissions.nav',
      'Submissions Area',
      'Your submissions show up here',
      '#al_center',
      '#al_center',
      'rightTop',
      [{ name: 'Next' }],
      true,
      '250px',
      this.send('doneTour')
    );
    this.guider.createGuider(
      'submissions.nav',
      'submissions.text',
      'Submission Navigation',
      'You can navigate between submissions using the dropdown or the arrows',
      '#submission-nav',
      '#submission-nav',
      'bottom',
      [{ name: 'Next' }],
      true,
      null,
      this.send('doneTour')
    );
    this.guider.createGuider(
      'submissions.text',
      'submissions.selection',
      'Submission Content',
      'Here is the short and long answer of the submission',
      '.submission-long',
      '#submission_container',
      'bottom',
      [{ name: 'Next' }],
      true,
      null,
      this.send('doneTour')
    );
    this.guider.createGuider(
      'submissions.selection',
      'submissions.selections',
      'Make a Selection',
      "Click the 'Make selection' button to begin making a selection. Then highlight the part of the submission you want to select. <br/><strong>Go ahead and make a selection now.</strong>",
      '#al_center',
      '#al_center',
      9,
      [{ name: 'Next' }],
      true,
      '200px',
      this.send('doneTour')
    );
    this.guider.createGuider(
      'submissions.selections',
      'comments',
      "You've made a selection!",
      "Great! Now click on your selection and let's see what we can do with it.",
      '#submission_selections',
      '#al_center',
      3,
      [{ name: 'Next' }],
      true,
      '300px',
      this.send('doneTour')
    );
    this.guider.createGuider(
      'comments',
      'comments.comment',
      'Commenting on a Selection',
      'Now that you have chosen a selection you can add comments.  Select one of the comment types: Notice, Wonder, Feedback and type a comment.',
      '#al_right',
      '#al_right',
      'leftTop',
      [{ name: 'Next' }],
      true,
      '250px',
      this.send('doneTour')
    );
    this.guider.createGuider(
      'comments.comment',
      'folders',
      'Your Comments Show up Here',
      "The most relevant comments show up at the top and have a darker highlighting.  You can check the box next to the comment to indicate you want to include this comment in your reply.  You'll notice that if there are comments selected you will have another button next to 'Make Selection' called 'Draft Reply'",
      '#al_feedback_display',
      '#al_feedback_display',
      9,
      [{ name: 'Next' }],
      true,
      null,
      this.send('doneTour')
    );
    this.guider.createGuider(
      'folders',
      'folders.counts',
      'Organizing Selections',
      'You can organize your selections by filing them in folders.  Folders contain other folders and can be expanded by clicking on the folder icon.  You can reorganize folders by dragging them into sub-folders.  You can also add and delete folders using the buttons at the bottom',
      '#al_left',
      '#al_left',
      2,
      [{ name: 'Next' }],
      true,
      null,
      this.send('doneTour')
    );
    this.guider.createGuider(
      'folders.counts',
      'fileSelection',
      'Folder Counts',
      'The count shows how many distinct submissions (left) and selections (right) have been filed in this folder (including all of the sub-folders)',
      '#al_folders>li.folderItem:eq(2) aside',
      '#al_folders>li.folderItem:eq(2) aside',
      12,
      [{ name: 'Next' }],
      true,
      null,
      this.send('doneTour')
    );
    this.guider.createGuider(
      'folders.counts',
      'done',
      'Folder Counts',
      'To file a selection, drag it to a folder',
      null,
      null,
      null,
      [{ name: 'Next' }],
      true,
      null,
      this.send('doneTour')
    );
    this.guider.createGuider(
      'done',
      '#takeTour',
      'Tour Completed',
      "You're all done.  If you want to re-take the tour, just hit this button",
      '#takeTour',
      null,
      9,
      [{ name: 'Close', onclick: this.send('doneTour') }],
      true,
      null,
      this.send('doneTour')
    );
  }

  @action
  doneTour() {
    let user = this.currentUser.user;
    user.set('seenTour', new Date());
    user.save();
  }

  @action
  cancelComment() {
    this.transitionToRoute('workspace.submission');
  }

  @action
  addSelection(selection, isUpdateOnly) {
    var user = this.currentUser.user;
    var workspace = this.currentWorkspace;
    var submission = this.model.submission;
    var controller = this;
    var newSelection = null;
    var alreadyExists = this.model.submission.selections.filterBy(
      'id',
      selection.id
    );

    if (alreadyExists.length > 0) {
      if (isUpdateOnly) {
        let oldSel = alreadyExists.get('firstObject');
        oldSel.set('relativeSize', selection.relativeSize);
        oldSel.set('relativeCoords', selection.relativeCoords);
        oldSel.save();

        return;
      }

      controller.alert.showToast(
        'error',
        'That selection already exists',
        'bottom-end',
        3000,
        false,
        null
      );
      return;
    }

    if (!submission.get('id')) {
      //ENC-475 possibility
      window.alert(
        'uh-oh: this submission looks odd, the selection might not save'
      );
    }

    switch (selection.selectionType) {
      case 'selection':
        newSelection = this.store.createRecord('selection', {
          text: selection.text,
          submission: submission,
          coordinates: selection.coords,
          workspace: workspace,
          createdBy: user,
        });
        break;

      case 'image-tag':
        newSelection = this.store.createRecord('selection', {
          text: selection.note,
          submission: submission,
          coordinates:
            selection.parent +
            ' ' +
            selection.coords.left +
            ' ' +
            selection.coords.top +
            ' ' +
            selection.size.width +
            ' ' +
            selection.size.height,
          workspace: workspace,
          createdBy: user,
          relativeCoords: selection.relativeCoords,
          relativeSize: selection.relativeSize,
          imageSrc: selection.imageSrc,
          vmtInfo: selection.vmtInfo,
        });
        break;

      default:
        controller.alert.showToast(
          'error',
          'Invalid selection type',
          'bottom-end',
          3000,
          false,
          null
        );

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

        controller.alert.showToast(
          'success',
          'Selection Created',
          'bottom-end',
          3000,
          false,
          null
        );

        controller.transitionToRoute(
          'workspace.submissions.submission.selections.selection',
          workspace.id,
          submission.id,
          newSelection.id
        );

        window.guiders.hideAll();

        if (!user.get('seenTour')) {
          //guiders._highlightElement('#al_center'); //shouldn't need to do this...
          //guiders.show('submissions.selections');
        }
      });
    }
  }

  @action
  deleteSelection(selection) {
    var controller = this;

    selection.set('isTrashed', true);

    selection.get('taggings').forEach(function (tag) {
      tag.set('isTrashed', true);
      tag.save().then(function (record) {
        record.deleteRecord();
      });
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

      controller.alert.showToast(
        'success',
        'Selection Deleted',
        'bottom-end',
        3000,
        false,
        null
      );

      controller.transitionToRoute(
        'workspace.submissions.submission',
        controller.model
      );
    });
  }

  @action
  toNewResponse(submission, workspace) {
    this.transitionToRoute('responses.new.submission', submission, {
      queryParams: { workspaceId: workspace },
    });
  }

  @action
  toSubmission(submission) {
    this.transitionToRoute('workspace.submissions.submission', submission);
  }

  @action
  toggleFolderDisplay() {
    this.areFoldersHidden = !this.areFoldersHidden;
  }

  @action
  toggleCommentDisplay() {
    this.areCommentsHidden = !this.areCommentsHidden;
  }
}
