import { A } from '@ember/array';
import Controller, { inject as controller } from '@ember/controller';
import EmberObject, { action } from '@ember/object';
import { run } from '@ember/runloop';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class FolderController extends Controller {
  @controller workspace;
  @service('workspace-permissions') permissions;

  @tracked browseOption = 1;
  @tracked includeSubfolders = true;
  @tracked submissionsCol = true;
  @tracked selectionsCol = true;
  @tracked commentsCol = false;
  @tracked foldersCol = false;
  @tracked showSubmissionFolders = false;
  @tracked showSubmissionComments = false;
  @tracked showSubmissionSelections = true;
  @tracked showSubmissionSelectionsComments = false;
  @tracked showSubmissionSelectionsFolders = true;
  @tracked showSelectionSubmission = true;
  @tracked showSelectionComments = true;
  @tracked showSelectionFolders = true;

  get currentWorkspace() {
    return this.workspace.model;
  }

  get bySelection() {
    return this.browseOption === 1;
  }

  get bySubmission() {
    return this.browseOption === 0;
  }

  get showSubmissionSelectionsStuff() {
    return (
      this.showSubmissionSelectionsComments ||
      this.showSubmissionSelectionsFolders
    );
  }

  get canEdit() {
    const workspace = this.currentWorkspace;
    return this.permissions.canEdit(workspace, 'selections', 3);
  }

  get evidence() {
    if (this.includeSubfolders) {
      return this.model.get('_selections');
    }
    return this.model.get('cleanSelections');
  }

  get selectedSubmissions() {
    if (this.includeSubfolders) {
      return this.model.get('_submissions');
    }
    return this.model.get('submissions');
  }

  get selectionGroups() {
    const submissions = this.model
      .get('_selections')
      .mapBy('submission')
      .uniq();
    const result = A();

    submissions.forEach((item) => {
      const selections = this.model
        .get('_selections')
        .filterBy('submission', item);
      const rowspan = 1 + selections.length;

      result.addObject(
        EmberObject.create({
          submission: item,
          content: selections,
          span: rowspan,
        })
      );
    });

    return result;
  }

  @action
  changeSubmission(submission) {
    const selector = `.submissionLink.${submission.get('id')}`;
    if (window.opener) {
      window.opener.$(selector).click();
    } else {
      this.transitionToRoute(
        'workspace.submission',
        this.currentWorkspace,
        submission
      );
    }
  }

  @action
  changeSelection(selection) {
    const selector = `.selectionLink.${selection.get('id')}`;
    run(() => {
      this.changeSubmission(selection.get('submission'));
      if (window.opener) {
        window.opener.$(selector).click();
      } else {
        this.transitionToRoute(
          'selection',
          selection.get('workspace'),
          selection.get('submission'),
          selection
        );
      }
    });
  }

  @action
  removeSelection(selection, folder) {
    selection.get('taggings').then((taggings) => {
      const tagging = taggings.findBy('folder', folder);
      if (tagging) {
        tagging.set('isTrashed', true);
        tagging.save().then(() => {
          if (window.opener) {
            const selector = `#updateTaggings${folder.get('id')}`;
            window.opener.$(selector).click();
          }
        });
      }
    });
  }
}
