import { A } from '@ember/array';
import Controller, { inject as controller } from '@ember/controller';
import EmberObject, { action } from '@ember/object';
import { alias, equal, or } from '@ember/object/computed';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { or, equal } from '@ember/object/computed';

export default class FolderController extends Controller {
  @controller workspace;
  @alias('workspace.model') currentWorkspace;
  @service('workspace-permissions') permissions;

  @tracked browseOption = 1;
  @equal('browseOption', 1) bySelection;
  @equal('browseOption', 0) bySubmission;
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

  @or('showSubmissionSelectionsComments', 'showSubmissionSelectionsFolders')
  showSubmissionSelectionsStuff;

  @computed('currentUser', 'currentWorkspace')
  get canEdit() {
    const workspace = this.currentWorkspace;
    return this.permissions.canEdit(workspace, 'selections', 3);
  }

  @computed(
    'model.id',
    'model.cleanSelections.[]',
    'model._selections.[]',
    'includeSubfolders'
  )
  get evidence() {
    if (this.includeSubfolders) {
      return this.model.get('_selections');
    }
    return this.model.get('cleanSelections');
  }

  @computed(
    'model',
    'model.submissions.[]',
    'model._submissions.[]',
    'includeSubfolders'
  )
  get selectedSubmissions() {
    if (this.includeSubfolders) {
      return this.model.get('_submissions');
    }
    return this.model.get('submissions');
  }

  @computed('model._selections.@each.submission')
  get selectionGroups() {
    const submissions = this.model
      .get('_selections')
      .getEach('submission')
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
      this.send('changeSubmission', selection.get('submission'));
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
