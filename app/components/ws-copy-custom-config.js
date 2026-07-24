import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import without from 'lodash-es/without';
import chain from 'lodash-es/chain';
import isNull from 'lodash-es/isNull';

export default class WsCopyCustomConfigComponent extends Component {
  @service('utility-methods') utils;

  @tracked submissionStudents = [];
  @tracked customSubmissionIds = [];
  @tracked showCustomSubmissionViewer = true;
  // referenced by the template; only ever set by the (now removed) dead
  // setSubmissions path, so it stays false
  @tracked noSubmissionsToCopy = false;

  // the per-aspect option groups. Each is a @tracked object reassigned wholesale
  // on change (updateCollectionOptions) so toggling a flag stays reactive.
  @tracked submissionOptions = {
    all: true,
    byStudent: false,
    custom: false,
    submissionIds: [],
  };
  @tracked folderOptions = {
    all: true,
    includeStructureOnly: false,
    none: false,
    folderIds: [],
  };
  @tracked selectionOptions = { all: true, none: false, selectionIds: [] };
  @tracked commentOptions = { all: true, none: false, commentIds: [] };
  @tracked responseOptions = { all: true, none: false, responseIds: [] };

  get showStudentSubmissionInput() {
    return this.submissionOptions.byStudent === true;
  }
  get selectedAllSubmissions() {
    return this.submissionOptions.all === true;
  }
  get selectedCustomSubmission() {
    return this.submissionOptions.custom === true;
  }
  get showCustomSubmissions() {
    return (
      this.submissionOptions.custom === true && this.showCustomSubmissionViewer
    );
  }
  get closedCustomView() {
    return (
      this.submissionOptions.custom === true && !this.showCustomSubmissionViewer
    );
  }

  get workspaceSubmissions() {
    return this.args.workspace.get('submissions');
  }

  get studentSelectOptions() {
    const options = [];
    const threads = this.args.submissionThreads;
    if (!threads) {
      return [];
    }
    threads.forEach((val, key) => {
      // key is the student name
      options.push({ label: key, value: key });
    });
    return options;
  }

  get submissionsFromStudents() {
    if (this.submissionOptions.all) {
      return this.args.workspace.get('submissions');
    }
    if (this.submissionOptions.custom) {
      const customIds = this.customSubmissionIds;
      if (!this.utils.isNonEmptyArray(customIds)) {
        return [];
      }
      return this.args.workspace
        .get('submissions')
        .filter((sub) => customIds.includes(sub.get('id')));
    }
    const threads = this.args.submissionThreads;
    const students = this.submissionStudents;
    if (!threads || !this.utils.isNonEmptyArray(students)) {
      return [];
    }
    return chain(students)
      .map((student) => threads.get(student))
      .flatten()
      .value();
  }

  get submissionIdsFromStudents() {
    return this.submissionsFromStudents.mapBy('id');
  }

  get submissionCount() {
    return this.args.workspace.get('submissions').map((sub) => sub.id);
  }

  get foldersCount() {
    return this.args.workspace.get('folders').map((folder) => folder.id);
  }

  get selectionsFromSubmissions() {
    return this.args.workspace.get('selections').filter((selection) => {
      return this.submissionIdsFromStudents.includes(
        selection.get('submission.content.id')
      );
    });
  }

  get commentsFromSelections() {
    if (this.selectionOptions.none === true) {
      return [];
    }
    return this.args.workspace.get('comments').filter((comment) => {
      return this.selectionsFromSubmissions.includes(
        comment.get('selection.content')
      );
    });
  }

  get responsesFromSubmissions() {
    return this.args.workspace.get('responses').filter((response) => {
      return this.submissionsFromStudents.includes(
        response.get('submission.content')
      );
    });
  }

  get formattedSubmissionOptions() {
    let submissionOptions = { all: true };

    if (this.submissionOptions.all) {
      return submissionOptions;
    }
    delete submissionOptions.all;

    if (this.submissionOptions.byStudent) {
      submissionOptions.submissionIds =
        this.submissionsFromStudents.mapBy('id');
      return submissionOptions;
    }

    if (this.submissionOptions.custom) {
      const customIds = this.customSubmissionIds;
      submissionOptions.submissionIds = this.utils.isNonEmptyArray(customIds)
        ? customIds
        : [];
      return submissionOptions;
    }
    return submissionOptions;
  }

  get formattedFolderOptions() {
    let folderOptions = { all: true };

    if (this.folderOptions.all) {
      folderOptions.includeStructureOnly = false;
      return folderOptions;
    }
    if (this.folderOptions.includeStructureOnly) {
      folderOptions.includeStructureOnly = true;
      return folderOptions;
    }
    delete folderOptions.all;
    delete folderOptions.includeStructureOnly;
    folderOptions.none = true;
    return folderOptions;
  }

  get formattedSelectionOptions() {
    let selectionOptions = { all: true };

    if (this.selectionOptions.all) {
      return selectionOptions;
    }
    if (this.selectionOptions.none) {
      selectionOptions.none = true;
      delete selectionOptions.all;
      return selectionOptions;
    }
    delete selectionOptions.all;
    selectionOptions.selectionIds = this.selectionsFromSubmissions.mapBy('id');
    return selectionOptions;
  }

  get formattedCommentOptions() {
    let commentOptions = { all: true };

    if (this.commentOptions.all) {
      return commentOptions;
    }
    if (this.commentOptions.none) {
      commentOptions.none = true;
      delete commentOptions.all;
      return commentOptions;
    }
    delete commentOptions.all;
    commentOptions.commentIds = this.commentsFromSelections.mapBy('id');
    return commentOptions;
  }

  get formattedResponseOptions() {
    let responseOptions = { all: true };

    if (this.responseOptions.all) {
      return responseOptions;
    }
    if (this.responseOptions.none) {
      responseOptions.none = true;
      delete responseOptions.all;
      return responseOptions;
    }
    delete responseOptions.all;
    responseOptions.responseIds = this.responsesFromSubmissions.mapBy('id');
    return responseOptions;
  }

  get formattedConfig() {
    return {
      submissionOptions: this.formattedSubmissionOptions,
      folderOptions: this.formattedFolderOptions,
      selectionOptions: this.formattedSelectionOptions,
      commentOptions: this.formattedCommentOptions,
      responseOptions: this.formattedResponseOptions,
    };
  }

  @action
  updateMultiSelect(val, item, propToUpdate) {
    if (!val) {
      return;
    }
    if (isNull(item)) {
      // removal
      this[propToUpdate] = without(this[propToUpdate], val);
      return;
    }
    this[propToUpdate] = [...this[propToUpdate], val];
  }

  @action
  updateCollectionOptions(val, propName) {
    let keys = ['all', 'none', 'custom'];
    if (propName === 'submissionOptions') {
      keys = ['all', 'byStudent', 'custom'];
    }
    if (propName === 'folderOptions') {
      keys = ['all', 'includeStructureOnly', 'none'];
    }
    if (!keys.includes(val)) {
      return;
    }

    // reassign the whole group object so the @tracked property is reactive
    const updated = { ...this[propName], [val]: true };
    without(keys, val).forEach((key) => {
      updated[key] = false;
    });
    this[propName] = updated;
  }

  @action
  next() {
    this.args.onProceed(this.formattedConfig);
  }

  @action
  back() {
    this.args.onBack(-1);
  }

  @action
  updateCustomSubs(id) {
    const isIn = this.customSubmissionIds.includes(id);
    if (isIn) {
      this.customSubmissionIds = without(this.customSubmissionIds, id);
    } else {
      this.customSubmissionIds = [...this.customSubmissionIds, id];
    }
  }

  @action
  selectAllSubmissions() {
    this.customSubmissionIds = this.args.workspace
      .get('submissions')
      .mapBy('id');
  }

  @action
  deselectAllSubmissions() {
    this.customSubmissionIds = [];
  }

  @action
  setDoneSelecting() {
    this.showCustomSubmissionViewer = false;
  }

  @action
  showCustomSelect() {
    this.showCustomSubmissionViewer = true;
  }
}
